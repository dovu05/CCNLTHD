from django.contrib import admin
from django.urls import path,include
from courses.admin import admin_site
from rest_framework.routers import DefaultRouter
from courses import views
from courses.views import CategoryView

r = DefaultRouter()
r.register('categories',views.CategoryView,basename="category")
r.register('courses',views.CourseView,basename="course")

urlpatterns = [
    path('', include(r.urls)),
]