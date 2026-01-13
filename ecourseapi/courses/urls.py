from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses import views

r = DefaultRouter()
r.register('categories', views.CategoryView, basename="category")
r.register('courses', views.CourseView, basename="course")
r.register('lessons', views.LessonView, basename="lesson")
r.register('users', views.UserView, basename="user")
r.register('comments', views.CommentView, basename="comment")

urlpatterns = [
    path('', include(r.urls)),
    # Endpoint cho OAuth2 (lấy token, refresh token...)
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]