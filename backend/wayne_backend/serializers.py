from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        logger.info(f'Tentativa de login para o usuário: {username}')

        if not username or not password:
            logger.warning('Username ou senha não fornecidos')
            raise serializers.ValidationError(
                _('Deve incluir "username" e "password".')
            )

        # Primeiro verifica se o usuário existe
        try:
            user = User.objects.get(username=username)
            logger.info(f'Usuário encontrado: {user.username}')
        except User.DoesNotExist:
            logger.warning(f'Usuário não encontrado: {username}')
            raise serializers.ValidationError(
                _('Usuário não encontrado.')
            )

        # Depois tenta autenticar
        user = authenticate(username=username, password=password)
        if not user:
            logger.warning(f'Falha na autenticação para o usuário: {username}')
            raise serializers.ValidationError(
                _('Senha incorreta.')
            )
        
        if not user.is_active:
            logger.warning(f'Usuário desativado: {username}')
            raise serializers.ValidationError(
                _('Usuário está desativado.')
            )

        logger.info(f'Login bem-sucedido para o usuário: {username}')
        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user 