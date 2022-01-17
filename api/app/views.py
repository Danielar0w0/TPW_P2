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
