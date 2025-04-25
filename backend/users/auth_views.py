from django.contrib.auth import login
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from .serializers import UserSerializer, UserCreateSerializer, AuthTokenSerializer
import logging
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            _, token = AuthToken.objects.create(user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AuthTokenSerializer

    def post(self, request, format=None):
        logger.info('Tentativa de login recebida')
        logger.debug('Dados recebidos: %s', request.data)
        
        try:
            serializer = self.serializer_class(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                user = serializer.validated_data['user']
                logger.debug('Usuário encontrado: %s', user.username)
                logger.debug('Usuário ativo: %s', user.is_active)
                
                if not user.is_active:
                    logger.warning('Tentativa de login com usuário inativo: %s', user.username)
                    return Response(
                        {'error': 'Usuário inativo. Entre em contato com o administrador.'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                logger.info('Usuário autenticado com sucesso: %s', user.username)
                
                # Criar token usando o Knox
                _, token = AuthToken.objects.create(user)
                logger.info('Token criado para o usuário: %s', user.username)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token
                })
            
            logger.warning('Falha na autenticação: %s', serializer.errors)
            return Response(
                {'error': 'Credenciais inválidas. Verifique seu usuário e senha.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        except Exception as e:
            logger.error('Erro durante o processo de login: %s', str(e))
            return Response(
                {'error': 'Erro interno do servidor. Tente novamente mais tarde.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        return Response({
            "user": UserSerializer(user).data,
        })

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Endpoint para obter o token CSRF.
    O decorador @ensure_csrf_cookie garante que o cookie será definido.
    """
    return Response({'detail': 'CSRF cookie set'}) 