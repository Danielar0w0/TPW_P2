from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

from app.models import User, Friendship, Post, Comment, Message
from app.serializers import UserSerializer, FriendshipSerializer, PostSerializer, CommentSerializer, MessageSerializer


@api_view(['GET', 'POST'])
def users(request):
    if request.method == 'GET':
        # if 'user_email':
        #    email = (...)
        #    try:
        #        user = User.objects.get(email=email)
        #    except ObjectDoesNotExist:
        #        return Response(status=status.HTTP_404_NOT_FOUND)

        #    serializer = UserSerializer(user)
        #    return Response(serializer.data)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

    if request.method == 'POST':

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def login(request):
    username = request.data['username']
    password = request.data['password']

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if user.password == password:
        return Response(status=status.HTTP_200_OK)

    return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register(request):
    username = request.data['username']
    password = request.data['password']
    email = request.data['email']
    # TODO: image
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def users(request):
    name = request.data['name']
    try:
        user = User.objects.get(name=name)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    users = User.objects.all().exclude(username=name)
    serializer = UserSerializer(data=users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user(request):
    email = request.data["email"]
    # check if user exists
    try:
        user = User.objects.get(user_email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(data=user)
    return Response(serializer.data)


@api_view(['GET', 'POST', 'DELETE'])
def posts(request):
    if request.method == 'GET':

        # print(request.data["user"])
        user_email = request.data["user"]
        # check if user exists
        try:
            user = User.objects.get(user_email=user_email)
        except User.DoesNotExist:
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
            user = User.objects.get(user_email=user_email)
        except User.DoesNotExist:
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
            User.objects.get(user_email=current_user)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        other_user = request.data["other_user"]
        # check if other user exists
        try:
            User.objects.get(user_email=other_user)
        except User.DoesNotExist:
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
            User.objects.get(user_email=current_user)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        other_user = request.data["other_user"]
        # check if other user exists
        try:
            User.objects.get(user_email=other_user)
        except User.DoesNotExist:
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
            User.objects.get(user_email=current_user)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        receptor = request.data["receptor"]
        # check if receptor exists
        try:
            User.objects.get(user_email=receptor)
        except User.DoesNotExist:
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
            User.objects.get(user_email=sender)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        receiver = request.data["receiver"]
        # check if receiver exists
        try:
            User.objects.get(user_email=receiver)
        except User.DoesNotExist:
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
