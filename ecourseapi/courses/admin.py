from django.contrib import admin
from courses.models import Category, Course, Lesson, Tag, Comment, Bookmark


admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Bookmark)