from django.contrib.auth.hashers import make_password
from django.http import JsonResponse

from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

from app.models import AppUser, Friendship, Post, Comment, Message
from app.serializers import UserSerializer, FriendshipSerializer, PostSerializer, CommentSerializer, MessageSerializer, \
    AuthSerializer


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

            django_user = User(username=serializer.validated_data['username'], email=serializer.validated_data['user_email'], password=hashed_password)
            django_user.save()

            app_user = AppUser(username=serializer.validated_data['username'], user_email=serializer.validated_data['user_email'], password=hashed_password, image=serializer.validated_data['image'])
            app_user.save()

            return JsonResponse({"message": "User registered."}, status=status.HTTP_201_CREATED)

        return JsonResponse({"message": "Invalid body request."}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):

    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, user_email):

        try:
            current_user = AppUser.objects.get(user_email=user_email)
        except AppUser.DoesNotExist:
            return JsonResponse({"message": "The user {} does not exists".format(user_email)}, status=status.HTTP_404_NOT_FOUND)

        return Response(UserSerializer(current_user).data, status=status.HTTP_200_OK)

    # @staticmethod
    # def post(request):
    #
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersView(generics.ListCreateAPIView):

    permission_classes = (IsAuthenticated,)
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer


@api_view(['GET', 'POST', 'DELETE'])
def posts(request):
    if request.method == 'GET':

        # print(request.data["user"])
        user_email = request.data["user"]
        # check if user exists
        try:
            user = AppUser.objects.get(user_email=user_email)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # check if posts from user exist
        try:
            posts = Post.objects.filter(user=user_email)
        except Post.DoesNotExist:
            # return Response("There aren't posts", status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(data=posts, many=True)
        return Response(serializer.data)
        # return Response(status=status.HTTP_200_OK)

    if request.method == 'POST':
        pass

    if request.method == 'DELETE':
        id = request.data["id"]
        # check if post exists
        try:
            post = Post.objects.get(post_id=id)
        except Post.DoesNotExist:
            # return Response("There aren't posts", status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_404_NOT_FOUND)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def post_comments(request, postId):
    if request.method == 'GET':
        # check if post exists
        try:
            post = Post.objects.get(post_id=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # check if comments from post exist
        try:
            comments = Comment.objects.filter(post=postId)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=comments, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        # check if post exists
        try:
            post = Post.objects.get(post_id=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user_email = request.data["user"]
        # check if user exists
        try:
            user = AppUser.objects.get(user_email=user_email)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        content = request.data["content"]
        comment = Comment(user=user_email, post=postId, content=content)

        serializer = CommentSerializer(data=comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # 400 é o código mais correto?
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
def friendship(request):
    if request.method == 'GET':
        # "name": "Ola" <= termo de pesquisa (opcional?)
        # "current_user": "test@ua.pt"
        pass

    if request.method == 'POST':
        current_user = request.data["current_user"]
        # check if current user exists
        try:
            AppUser.objects.get(user_email=current_user)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        other_user = request.data["other_user"]
        # check if other user exists
        try:
            AppUser.objects.get(user_email=other_user)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        friendship = Friendship(first_user=current_user, second_user=other_user)

        serializer = FriendshipSerializer(data=friendship)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # 400 é o código mais correto?
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        current_user = request.data["current_user"]
        # check if current user exists
        try:
            AppUser.objects.get(user_email=current_user)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        other_user = request.data["other_user"]
        # check if other user exists
        try:
            AppUser.objects.get(user_email=other_user)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # check if friendship exists
        try:
            friendship = Friendship.objects.filter(first_user=current_user, second_user=other_user)
        except Friendship.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        for friend in friendship:
            friend.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def messages(request):
    if request.method == 'GET':
        current_user = request.data["current_user"]
        # check if current user exists
        try:
            AppUser.objects.get(user_email=current_user)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        receptor = request.data["receptor"]
        # check if receptor exists
        try:
            AppUser.objects.get(user_email=receptor)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            messages = Message.objects.filter(sender=current_user, receiver=receptor)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MessageSerializer(data=messages, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        sender = request.data["sender"]
        # check if sender exists
        try:
            AppUser.objects.get(user_email=sender)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        receiver = request.data["receiver"]
        # check if receiver exists
        try:
            AppUser.objects.get(user_email=receiver)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        content = request.data["message"]
        # É preciso verificar se podem enviar mensagens um ao outro?
        message = Message(sender=sender, receiver=receiver, content=content)

        serializer = MessageSerializer(data=message)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # 400 é o código mais correto?
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_messages_from_user(request):
    pass


# TODO:
#  Re-use the code bellow in a new search endpoint. That endpoint, 'api/search', should receive
#  the type of the search - USER_NAME, USER_EMAIL, POST_DESCRIPTION etc... and the query.
#  This query will be the name of the user, or the email, and so on.

# @staticmethod
    # def get(request):
    #
    #     name = request.data['name']
    #     try:
    #         user = AppUser.objects.get(name=name)
    #     except AppUser.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    #
    #     users = AppUser.objects.all().exclude(username=name)
    #     serializer = UserSerializer(data=users, many=True)
    #     return Response(serializer.data)
