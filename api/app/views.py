from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.utils.authentication import AppAuthorizer
from app.models import AppUser, Friendship, Post, Comment, Message
from app.serializers import UserSerializer, FriendshipSerializer, PostSerializer, CommentSerializer, MessageSerializer, \
    AuthSerializer

from django.db.models import Q
from app.utils.query_type import QueryType


# A.k.a Login
class AppAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):

        serializer = AuthSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                current_user = User.objects.get(email=email)

                if not current_user.check_password(password):
                    return JsonResponse({'message': 'Wrong log-in details.'}, status=status.HTTP_401_UNAUTHORIZED)

            except User.DoesNotExist:
                return JsonResponse({'message': 'Wrong log-in details.'}, status=status.HTTP_401_UNAUTHORIZED)

            token, created = Token.objects.get_or_create(user=current_user)

            return JsonResponse({
                'token': token.key,
                'user_id': current_user.pk,
                'email': current_user.email
            }, status=status.HTTP_200_OK)

        return JsonResponse({'message': 'Invalid body request'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):

    @staticmethod
    def post(request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            password = serializer.validated_data['password']
            hashed_password = make_password(password, hasher='bcrypt_sha256')
            image_field = request.data['image'] if 'image' in request.data else None

            app_user = AppUser(username=serializer.validated_data['username'],
                               user_email=serializer.validated_data['user_email'], password=hashed_password,
                               image=image_field)
            app_user.save()

            django_user = User(username=serializer.validated_data['username'],
                               email=serializer.validated_data['user_email'], password=hashed_password)
            django_user.save()

            return JsonResponse({"message": "User registered."}, status=status.HTTP_201_CREATED)

        return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    # To protect the endpoint with TokenAuthentication
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, user_email):

        try:
            current_user = AppUser.objects.get(user_email=user_email)
        except AppUser.DoesNotExist:
            return JsonResponse({"message": "The user {} does not exists".format(user_email)},
                                status=status.HTTP_404_NOT_FOUND)

        return Response(UserSerializer(current_user).data, status=status.HTTP_200_OK)


class UsersView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer


class PostsView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, user_email=None):

        if request.GET:

            post_id = request.GET['id']
            post_exists = Post.objects.filter(post_id=post_id).exists()

            if not post_exists:
                return JsonResponse({"message": "Unable to find the post {}.".format(post_id)},
                                    status=status.HTTP_404_NOT_FOUND)

            serializer = PostSerializer(Post.objects.get(post_id=post_id))
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif user_email is not None:

            user_exists = AppUser.objects.filter(user_email=user_email).exists()

            if not user_exists:
                return JsonResponse({"message": "Unable to find the user {}.".format(user_email)},
                                    status=status.HTTP_404_NOT_FOUND)

            try:
                user_posts = Post.objects.filter(user__user_email=user_email)
            except Post.DoesNotExist:
                return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

            serializer = PostSerializer(user_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:

            app_auth = AppAuthorizer(request)

            if not app_auth.is_admin():
                return app_auth.unauthorized_response()

            all_posts = Post.objects.all()
            serializer = PostSerializer(all_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def post(request):

        serializer = PostSerializer(data=request.data)

        # If the serializer data is not valid an exception is raised.
        # We don't need to perform any extra check here
        serializer.is_valid(raise_exception=True)

        post_owner = serializer.validated_data['user']

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(post_owner.user_email):
            return app_auth.unauthorized_response()

        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    @staticmethod
    def delete(request):

        if 'id' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        post_id = request.data["id"]

        try:
            post_entity = Post.objects.get(post_id=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"message": "Unable to find the post {}.".format(post_id)},
                                status=status.HTTP_404_NOT_FOUND)

        post_owner_entity = post_entity.user

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(post_owner_entity.user_email):
            return app_auth.unauthorized_response()

        post_entity.delete()
        return JsonResponse({"message": "Post successfully deleted."}, status=status.HTTP_200_OK)


class PostCommentsView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, post_id):

        post_exists = Post.objects.filter(post_id=post_id).exists()

        if not post_exists:
            return JsonResponse({"message": "Unable to find the post {}.".format(post_id)},
                                status=status.HTTP_404_NOT_FOUND)

        # check if comments from post exist
        try:
            comments = Comment.objects.filter(post=post_id)
        except Comment.DoesNotExist:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def post(request, post_id):

        if 'user' not in request.data or 'content' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        post_content = request.data['content']
        post_user_email = request.data['user']

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(post_user_email):
            return app_auth.unauthorized_response()

        post_exists = Post.objects.filter(post_id=post_id).exists()
        user_exists = AppUser.objects.filter(user_email=post_user_email).exists()

        if not post_exists:
            return JsonResponse({"message": "Unable to find the post {}.".format(post_id)},
                                status=status.HTTP_404_NOT_FOUND)
        elif not user_exists:
            return JsonResponse({"message": "Unable to find the user {}.".format(post_user_email)},
                                status=status.HTTP_404_NOT_FOUND)

        post_user = AppUser.objects.get(user_email=post_user_email)
        post_entity = Post.objects.get(post_id=post_id)

        post_comment = Comment(user=post_user, post=post_entity, content=post_content)
        post_comment.save()

        serializer = CommentSerializer(post_comment)

        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def delete(request, post_id):

        if 'id' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        comment_id = request.data['id']

        post_exists = Post.objects.filter(post_id=post_id).exists()
        comment_exists = Comment.objects.filter(post_id=post_id, comment_id=comment_id).exists()

        if not post_exists:
            return JsonResponse({"message": "Unable to find the post {}.".format(post_id)},
                                status=status.HTTP_404_NOT_FOUND)
        elif not comment_exists:
            return JsonResponse({"message": "Unable to find the comment {}.".format(comment_id)},
                                status=status.HTTP_404_NOT_FOUND)

        current_comment = Comment.objects.get(post_id=post_id, comment_id=comment_id)
        current_comment_owner = current_comment.user

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(current_comment_owner.user_email):
            return app_auth.unauthorized_response()

        current_comment.delete()

        return JsonResponse(
            {"message": "Comment {} from post {} was successfully deleted.".format(comment_id, post_id)},
            status=status.HTTP_200_OK)


class FriendshipsView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, user_email=None):

        if user_email is None:
            return JsonResponse({"message": "Invalid request (Missing path variable)."}, status=status.HTTP_400_BAD_REQUEST)

        user_exists = AppUser.objects.filter(user_email=user_email).exists()

        if not user_exists:
            return JsonResponse({"message": "Unable to find user {}.".format(user_email)},
                                status=status.HTTP_404_NOT_FOUND)

        try:
            all_friendships = Friendship.objects.filter(Q(first_user__user_email=user_email) | Q(second_user__user_email=user_email))
        except Friendship.DoesNotExist:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        serializer = FriendshipSerializer(all_friendships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def post(request):

        if 'current_user' not in request.data or 'other_user' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        current_user_email = request.data["current_user"]
        other_user_email = request.data["other_user"]

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(current_user_email):
            return app_auth.unauthorized_response()

        if current_user_email == other_user_email:
            return JsonResponse({"message": "Unable to create friendship with self."},
                                status=status.HTTP_400_BAD_REQUEST)

        current_user_exists = AppUser.objects.filter(user_email=current_user_email).exists()
        other_user_exists = AppUser.objects.filter(user_email=other_user_email).exists()

        if not current_user_exists or not other_user_exists:
            return JsonResponse({"message": "Either the current user or the second user don't exist."},
                                status=status.HTTP_404_NOT_FOUND)

        current_user_entity = AppUser.objects.get(user_email=current_user_email)
        other_user_entity = AppUser.objects.get(user_email=other_user_email)

        friendship_entity = Friendship(first_user=current_user_entity, second_user=other_user_entity)
        friendship_entity.save()

        serializer = FriendshipSerializer(friendship_entity)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def delete(request):

        if 'current_user' not in request.data or 'other_user' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        current_user_email = request.data["current_user"]
        other_user_email = request.data["other_user"]

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(current_user_email) and not app_auth.is_authorized(other_user_email):
            return app_auth.unauthorized_response()

        if current_user_email == other_user_email:
            return JsonResponse({"message": "Unable to delete friendship with self."},
                                status=status.HTTP_400_BAD_REQUEST)

        current_user_exists = AppUser.objects.filter(user_email=current_user_email).exists()
        other_user_exists = AppUser.objects.filter(user_email=other_user_email).exists()

        if not current_user_exists or not other_user_exists:
            return JsonResponse({"message": "Either the current user or the second user don't exist."},
                                status=status.HTTP_404_NOT_FOUND)

        try:
            friendship_entities = Friendship.objects.filter(Q(first_user__user_email=current_user_email,
                                                            second_user__user_email=other_user_email) | Q(first_user__user_email=other_user_email,
                                                            second_user__user_email=current_user_email))
        except Friendship.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if len(friendship_entities) <= 0:
            return JsonResponse({"message": "Unable to find the friendship between the users."},
                                status=status.HTTP_404_NOT_FOUND)

        for friendship_entity in friendship_entities:
            friendship_entity.delete()

        return JsonResponse({"message": "Friendship deleted."}, status=status.HTTP_200_OK)


class MessagesView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):

        if 'current_user' not in request.GET or 'receptor' not in request.GET:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        current_user_email = request.GET["current_user"]
        receptor_user_email = request.GET["receptor"]

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(current_user_email):
            return app_auth.unauthorized_response()

        current_user_exists = AppUser.objects.filter(user_email=current_user_email).exists()
        receptor_user_exists = AppUser.objects.filter(user_email=receptor_user_email).exists()

        if not current_user_exists or not receptor_user_exists:
            return JsonResponse({"message": "Unable to find one (or both) of the provided user(s)."},
                                status=status.HTTP_404_NOT_FOUND)

        try:
            all_messages_entities = Message.objects.filter(sender__user_email=current_user_email,
                                                           receiver__user_email=receptor_user_email)
        except Message.DoesNotExist:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        serializer = MessageSerializer(all_messages_entities, many=True)
        return Response(serializer.data)

    @staticmethod
    def post(request):

        if 'sender' not in request.data or 'receiver' not in request.data or 'message' not in request.data:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        sender_email = request.data["sender"]
        receiver_email = request.data["receiver"]
        message_content = request.data["message"]

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(sender_email):
            return app_auth.unauthorized_response()

        # Forbid user to message himself
        if sender_email == receiver_email:
            return JsonResponse({"message": "Unable to message self account."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender_entity = AppUser.objects.get(user_email=sender_email)
            receiver_entity = AppUser.objects.get(user_email=receiver_email)
        except AppUser.DoesNotExist:
            return JsonResponse({"message": "Unable to find one (or both) of the provided user(s)."},
                                status=status.HTTP_404_NOT_FOUND)

        message_entity = Message(sender=sender_entity, receiver=receiver_entity, content=message_content)
        message_entity.save()

        serializer = MessageSerializer(message_entity)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessagesQueryView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, user_email=None):

        if user_email is None:
            return JsonResponse({"message": "Invalid request (Missing path variable)."}, status=status.HTTP_400_BAD_REQUEST)

        app_auth = AppAuthorizer(request)

        if not app_auth.is_authorized(user_email):
            return app_auth.unauthorized_response()

        current_user_exists = AppUser.objects.filter(user_email=user_email).exists()

        if not current_user_exists:
            return JsonResponse({"message": "Unable to find the user {}.".format(user_email)},
                                status=status.HTTP_404_NOT_FOUND)

        all_messages_entities = Message.objects.filter(Q(sender__user_email=user_email) | Q(receiver__user_email=user_email))

        serializer = MessageSerializer(all_messages_entities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchQueryView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):

        if 'query_type' not in request.GET or 'query' not in request.GET:
            return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)

        query_type = request.GET['query_type']
        query = request.GET['query']

        if query_type == QueryType.USER_NAME.name:

            try:
                users = AppUser.objects.filter(username__contains=query)
            except AppUser.DoesNotExist:
                return JsonResponse({"message": "Unable to find the user {}.".format(query)},
                                    status=status.HTTP_404_NOT_FOUND)

            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif query_type == QueryType.USER_EMAIL.name:

            try:
                users = AppUser.objects.filter(user_email=query)
            except AppUser.DoesNotExist:
                return JsonResponse({"message": "Unable to find the user {}.".format(query)},
                                    status=status.HTTP_404_NOT_FOUND)

            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif query_type == QueryType.POST_DESCRIPTION.name:

            try:
                posts = Post.objects.filter(description__contains=query)
            except Post.DoesNotExist:
                return JsonResponse({"message": "Unable to find the user {}.".format(query)},
                                    status=status.HTTP_404_NOT_FOUND)

            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif query_type == QueryType.MESSAGE_SENDER_RECEIVER.name:

            try:
                messages = Message.objects.filter(
                    Q(sender__username__contains=query) | Q(receiver__username__contains=query))
            except Message.DoesNotExist:
                return JsonResponse({"message": "Unable to find the user {}.".format(query)},
                                    status=status.HTTP_404_NOT_FOUND)

            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return JsonResponse({"message": "Unknown query type."}, status=status.HTTP_400_BAD_REQUEST)


class PictureQueryView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def patch(request, user_email=None):

        if not user_email or 'image' not in request.data or 'email' not in request.data:
            return JsonResponse({'message': 'Invalid body request'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data['email']
        if email != user_email:
            return JsonResponse({'message': 'Unauthorized user'}, status=status.HTTP_401_UNAUTHORIZED)

        file = request.data['image']
        try:

            app_user = AppUser.objects.get(user_email=user_email)
            serializer = UserSerializer(app_user, data=request.data, partial=True)

            if serializer.is_valid(raise_exception=True):
                serializer.save()

                try:
                    django_user = User.objects.get(email=user_email)
                    django_user.file = file
                    django_user.save()

                except AppUser.DoesNotExist:
                    return JsonResponse({'message': 'Invalid user.'}, status=status.HTTP_401_UNAUTHORIZED)

                app_user.file = file
                app_user.save()

                return Response(serializer.data, status=status.HTTP_200_OK)

            return JsonResponse({'message': 'Invalid body request'}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return JsonResponse({'message': 'Invalid user.'}, status=status.HTTP_401_UNAUTHORIZED)
