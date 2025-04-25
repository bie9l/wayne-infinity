from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer
)
from .permissions import IsAdminOrSecurityAdmin, IsAdminOrManager

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            permission_classes = [IsAdminOrSecurityAdmin]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsAdminOrManager]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = self.get_object()
        if not request.user.has_admin_access() and request.user != user:
            return Response(
                {'error': 'Você não tem permissão para alterar a senha deste usuário'},
                status=status.HTTP_403_FORBIDDEN
            )

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response(
                {'error': 'Forneça a senha antiga e a nova senha'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {'error': 'Senha antiga incorreta'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Senha alterada com sucesso'})
