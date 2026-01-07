from rest_framework.permissions import IsAuthenticated



class CommentOwner(IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_object_permission(request, view,comment) and request.user == comment.user