"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/users', views.users),
    path('api/login', views.login),
    path('api/register', views.register),
    path('api/users', views.users),
    path('api/user', views.user),
    path('api/posts', views.posts),
    path('api/posts/<int:postId>/comments', views.post_comments),
    path('api/friendship', views.friendship),
    path('api/messages', views.messages),
    path('api/user/messages', views.get_messages_from_user)
]
