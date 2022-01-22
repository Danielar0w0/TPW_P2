from django.http import JsonResponse
from rest_framework import status
from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    def __init__(self):
        self.keyword = 'Bearer'
        super().__init__()


class AppAuthorizer:

    def __init__(self, request):
        self.request = request

    def is_admin(self):
        return self.request.user.is_staff

    def is_authorized(self, email):
        if self.request.user.email != email and not self.request.user.is_staff:
            return False
        return True

    @staticmethod
    def unauthorized_response():
        return JsonResponse({"message": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
