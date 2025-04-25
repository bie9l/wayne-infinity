from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SecurityIncident, SecurityLog
from .serializers import SecurityIncidentSerializer, SecurityLogSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class SecurityIncidentViewSet(viewsets.ModelViewSet):
    queryset = SecurityIncident.objects.all()
    serializer_class = SecurityIncidentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['severity', 'status']
    search_fields = ['title', 'description', 'reported_by', 'location', 'affected_assets']
    ordering_fields = ['reported_at', 'severity', 'status', 'created_at']
    ordering = ['-reported_at']

class SecurityLogViewSet(viewsets.ModelViewSet):
    queryset = SecurityLog.objects.all()
    serializer_class = SecurityLogSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['event_type']
    search_fields = ['description', 'user', 'ip_address', 'device_id', 'location']
    ordering_fields = ['created_at', 'event_type']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        logger.info(f'Recebendo dados para criar log: {request.data}')
        try:
            response = super().create(request, *args, **kwargs)
            logger.info(f'Log criado com sucesso: {response.data}')
            return response
        except Exception as e:
            logger.error(f'Erro ao criar log: {str(e)}')
            raise

    def list(self, request, *args, **kwargs):
        logger.info('Listando logs de segurança')
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f'Logs encontrados: {len(response.data)}')
            return response
        except Exception as e:
            logger.error(f'Erro ao listar logs: {str(e)}')
            raise
