from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class AuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        logger.debug('Tentativa de validação para usuário: %s', username)
        logger.debug('Dados recebidos: username=%s, password=****', username)

        if username and password:
            # Verificar se o usuário existe
            try:
                user = User.objects.get(username=username)
                logger.debug('Usuário encontrado: %s', user.username)
                logger.debug('Usuário ativo: %s', user.is_active)
            except User.DoesNotExist:
                logger.warning('Usuário não encontrado: %s', username)
                raise serializers.ValidationError(
                    'Credenciais inválidas. Verifique seu usuário e senha.',
                    code='authorization'
                )

            # Tentar autenticar o usuário
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )

            if not user:
                logger.warning(
                    'Falha na autenticação para o usuário: %s',
                    username
                )
                raise serializers.ValidationError(
                    'Credenciais inválidas. Verifique seu usuário e senha.',
                    code='authorization'
                )

            logger.debug('Usuário autenticado: %s', user.username)
            logger.debug('Status do usuário: ativo=%s', user.is_active)

            if not user.is_active:
                logger.warning(
                    'Tentativa de login com usuário inativo: %s',
                    username
                )
                raise serializers.ValidationError(
                    'Usuário inativo. Entre em contato com o administrador.',
                    code='authorization'
                )

            attrs['user'] = user
            return attrs
        else:
            logger.warning('Credenciais incompletas recebidas')
            raise serializers.ValidationError(
                'Credenciais incompletas. Forneça usuário e senha.',
                code='authorization'
            )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'department', 'position', 'phone',
            'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'first_name', 'last_name',
            'user_type', 'department', 'position', 'phone'
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', 'employee'),
            department=validated_data.get('department', ''),
            position=validated_data.get('position', ''),
            phone=validated_data.get('phone', '')
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email', 'first_name', 'last_name',
            'user_type', 'department', 'position', 'phone',
            'is_active'
        ) 