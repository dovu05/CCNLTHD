from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from courses.models import User



class CommentOwner(IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_object_permission(request, view,comment) and request.user == comment.user

class IsTeacher(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == User.TEACHER

class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == User.STUDENT


class IsCourseOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.teacher == request.user