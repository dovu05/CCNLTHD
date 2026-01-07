from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.safestring import mark_safe
from django.urls import path
from courses.models import Category,Course,Lesson,User,Tag,Comment,Like


class MyAdminSite(admin.AdminSite):
    site_header = "Hệ thống khóa học trực tuyến"

    def get_urls(self):
        return [path("course-stats/", self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        stats = Category.objects.annotate(count=Count('course')).values('id','name','count')
        return TemplateResponse(request, 'admin/stats.html', {'stats': stats})

class CategoryAdmin(admin.ModelAdmin):
    pass

class CourseAdmin(admin.ModelAdmin):
    readonly_fields = ['image_view']

    def image_view(self, obj):
        if obj and obj.image:
            return mark_safe(f"<img src='{obj.image.url}' width='150' style='border-radius:8px;")

class LessonAdmin(admin.ModelAdmin):
    pass

class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Role & Avatar', {'fields': ('role', 'avatar')}),
    )

admin_site = MyAdminSite(name='eCourse')

admin_site.register(User, UserAdmin)
admin_site.register(Category,CategoryAdmin)
admin_site.register(Course,CourseAdmin)
admin_site.register(Lesson,LessonAdmin)
admin_site.register(Tag)
admin_site.register(Comment)
admin_site.register(Like)


