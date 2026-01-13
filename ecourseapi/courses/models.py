from django.utils import timezone
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ADMIN = 'admin'
    STUDENT = 'student'
    TEACHER = 'teacher'

    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=STUDENT
    )
    avatar = CloudinaryField('avatar', null=True, blank=True)  # [cite: 5]

    #  Giảng viên cần được duyệt và xác minh trước khi tạo khóa học
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Course(BaseModel):
    subject = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)  # Mô tả chi tiết
    image = CloudinaryField('image', null=True, blank=True)  # Hình ảnh minh họa

    #  Video giới thiệu
    trailer_video = CloudinaryField('video', resource_type='video', null=True, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Học phí

    #  Thời lượng học (tính bằng giờ hoặc phút) phục vụ so sánh
    duration = models.IntegerField(default=0, help_text="Duration in minutes")

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': User.TEACHER},
        related_name='courses'
    )

    class Meta:
        unique_together = ('subject', 'category')

    def __str__(self):
        return self.subject


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    content = RichTextField()
    image = CloudinaryField(null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.RESTRICT, related_name='lessons')
    tags = models.ManyToManyField(Tag, blank=True)

    class Meta:
        unique_together = ('subject', 'course')

    def __str__(self):
        return self.subject


#  Hệ thống cần cho phép giảng viên theo dõi tiến độ học tập của từng sinh viên
class LessonProgress(BaseModel):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student.username} - {self.lesson.subject}"


class Interaction(BaseModel):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, null=False, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.TextField(null=False, blank=False)


class Like(Interaction):
    class Meta:
        unique_together = ('user', 'lesson')


#  Hỗ trợ so sánh/đánh giá khóa học (Mở rộng thêm Rating cho Course)
class Rating(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings')
    rate = models.PositiveSmallIntegerField(default=5)  # 1-5 sao
    comment = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'course')


class Enrollment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} - {self.course.subject}"


# [cite: 13, 14] Ghi nhận giao dịch và phương thức thanh toán
class Receipt(BaseModel):
    PAYMENT_METHODS = (
        ('CASH', 'Tiền mặt'),
        ('MOMO', 'MoMo'),
        ('ZALOPAY', 'ZaloPay'),
        ('STRIPE', 'Stripe'),
        ('PAYPAL', 'PayPal'),
    )
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receipts')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS, default='CASH')

    def __str__(self):
        return f"Receipt {self.id} - {self.student.username}"