from rest_framework import viewsets, generics, status, parsers, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q, Sum, Count
from courses import serializers, paginators, perms
from courses.models import Category, Course, Lesson, User, Comment, Enrollment, Receipt, Like


class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CourseView(viewsets.ModelViewSet):
    queryset = Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer
    pagination_class = paginators.ItemPaginator

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject', 'category__name', 'teacher__username']
    ordering_fields = ['price', 'created_date']

    def get_queryset(self):
        query = self.queryset
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        # Lấy danh sách khóa học của giảng viên hiện tại (Dùng Token OAuth2 để xác định user)
        if self.action == 'my_courses' and self.request.user.is_authenticated:
            return Course.objects.filter(teacher=self.request.user, active=True)

        return query

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_lessons', 'get_comments', 'compare']:
            return [permissions.AllowAny()]
        if self.action in ['create', 'my_courses', 'stats']:
            return [perms.IsTeacher()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [perms.IsTeacher(), perms.IsCourseOwner()]
        if self.action in ['enrolls']:
            return [permissions.IsAuthenticated()]  # Yêu cầu OAuth2 Token
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(methods=['get'], url_path='my-courses', detail=False)
    def my_courses(self, request):
        courses = self.get_queryset()
        page = self.paginate_queryset(courses)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(courses, many=True).data)

    @action(methods=['post'], url_path='enrolls', detail=True)
    def get_enroll(self, request, pk):
        course = self.get_object()
        student = request.user

        # Logic đăng ký học...
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response({"message": "Already enrolled"}, status=status.HTTP_200_OK)

        if course.price > 0:
            payment_method = request.data.get('payment_method', 'CASH')
            Receipt.objects.create(student=student, course=course, amount=course.price, payment_method=payment_method)

        Enrollment.objects.create(student=student, course=course)
        return Response({"message": "Enrolled successfully"}, status=status.HTTP_201_CREATED)

    # ... (Giữ nguyên các action get_lessons, compare, stats như code cũ)
    @action(methods=['get'], url_path="lessons", detail=True)
    def get_lessons(self, request, pk):
        course = self.get_object()
        lessons = course.lessons.filter(active=True)
        return Response(serializers.LessonSerializer(lessons, many=True).data)

    @action(methods=['post'], detail=False, url_path='compare')
    def compare(self, request):
        course_ids = request.data.get('course_ids', [])
        courses = Course.objects.filter(id__in=course_ids)
        data = []
        for c in courses:
            data.append({
                "id": c.id,
                "subject": c.subject,
                "price": c.price,
                "teacher": c.teacher.get_full_name() if c.teacher else "Unknown",
                "category": c.category.name,
                "lessons_count": c.lessons.count()
            })
        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='teacher-stats')
    def stats(self, request):
        teacher = request.user
        total_revenue = Receipt.objects.filter(course__teacher=teacher).aggregate(Sum('amount'))['amount__sum'] or 0
        course_stats = Course.objects.filter(teacher=teacher).annotate(
            student_count=Count('enrollment'),
            revenue=Sum('receipts__amount')
        ).values('id', 'subject', 'student_count', 'revenue')
        return Response({"total_revenue": total_revenue, "courses": course_stats})


class LessonView(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Lesson.objects.filter(active=True)
    serializer_class = serializers.LessonDetailsSerializer

    def get_permissions(self):
        # Các hành động like, comment yêu cầu phải đăng nhập (có Token)
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['post'], detail=True, url_path='comments')
    def add_comment(self, request, pk):
        content = request.data.get('content')
        if not content:
            return Response({"error": "Content required"}, status=status.HTTP_400_BAD_REQUEST)
        c = Comment.objects.create(content=content, user=request.user, lesson=self.get_object())
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=True, url_path='list-comments')
    def list_comments(self, request, pk):
        comments = self.get_object().comment_set.select_related('user').filter(active=True)
        p = paginators.CommentPaginator()
        page = p.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)
        return Response(serializers.CommentSerializer(comments, many=True).data)

    @action(methods=['post'], detail=True, url_path='like')
    def like(self, request, pk):
        lesson = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, lesson=lesson)
        if not created:
            like.delete()
            return Response({"liked": False}, status=status.HTTP_200_OK)
        return Response({"liked": True}, status=status.HTTP_201_CREATED)


class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action in ['current_user']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        # API này dùng để lấy thông tin user từ Token OAuth2 gửi lên
        u = request.user
        if request.method == 'PATCH':
            for k, v in request.data.items():
                if k in ['first_name', 'last_name', 'email']:
                    setattr(u, k, v)
            u.save()
        return Response(serializers.UserSerializer(u).data)


# Các View khác giữ nguyên
class TagView(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Lesson.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.LessonDetailsSerializer


class CommentView(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]