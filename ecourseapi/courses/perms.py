from rest_framework import permissions

class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_object_permission(request, view, comment) and request.user == comment.user

class IsTeacher(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'teacher'

class IsStudent(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'student'

# Class mới: Kiểm tra giảng viên đã được Admin duyệt hay chưa
class IsVerified(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        # Chỉ cho phép nếu user đã đăng nhập VÀ field is_verified = True
        return bool(request.user and request.user.is_authenticated and request.user.is_verified)

class IsCourseOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.teacher == request.user