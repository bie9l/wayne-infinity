"""
URL configuration for wayne_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include
from knox import views as knox_views
from django.conf import settings
from users.auth_views import RegisterView, LoginView, UserAPIView, get_csrf_token
from .dashboard import DashboardView

# Configuração do Admin
admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE
admin.site.index_title = settings.ADMIN_INDEX_TITLE

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/auth/logout-all/', knox_views.LogoutAllView.as_view(), name='logout-all'),
    path('api/auth/user/', UserAPIView.as_view(), name='user'),
    path('api/auth/csrf/', get_csrf_token, name='csrf'),
    path('api/users/', include('users.urls')),
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    path('api/vehicles/', include('vehicles.urls')),
    path('api/equipment/', include('equipment.urls')),
    path('api/devices/', include('devices.urls')),
    path('api/security/', include('security.urls')),
]
