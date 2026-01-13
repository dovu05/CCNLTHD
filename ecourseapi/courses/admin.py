from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.safestring import mark_safe
from django.urls import path
from courses.models import Category, Course, Lesson, User, Tag, Comment, Like, Enrollment, Receipt


class MyAdminSite(admin.AdminSite):
    site_header = "Hệ thống khóa học trực tuyến"

    def get_urls(self):
        return [path("course-stats/", self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        # Thống kê số lượng khóa học theo danh mục
        stats = Category.objects.annotate(count=Count('course')).values('id', 'name', 'count')
        return TemplateResponse(request, 'admin/stats.html', {'stats': stats})


class UserAdmin(DjangoUserAdmin):
    # Hiển thị cột verified trong danh sách user
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff')

    # Thêm trường is_verified vào form chỉnh sửa chi tiết
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Role & Verification', {'fields': ('role', 'avatar', 'is_verified')}),
    )


class CourseAdmin(admin.ModelAdmin):
    list_display = ('subject', 'category', 'teacher', 'active', 'created_date')
    search_fields = ('subject', 'teacher__username')
    readonly_fields = ['image_view']

    def image_view(self, obj):
        if obj and obj.image:
            return mark_safe(f"<img src='{obj.image.url}' width='150' style='border-radius:8px;' />")


# Đăng ký các model
admin_site = MyAdminSite(name='myadmin')

admin.site.register(Category)
admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson)
admin.site.register(User, UserAdmin)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Enrollment)
admin.site.register(Receipt)