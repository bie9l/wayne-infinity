from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Equipment
from .serializers import EquipmentSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['type', 'status']
    search_fields = [
        'name', 'serial_number', 'model',
        'manufacturer', 'location'
    ]
    ordering_fields = ['name', 'status', 'created_at', 'updated_at']
    ordering = ['name']

    def destroy(self, request, *args, **kwargs):
        logger.info(
            f'Recebendo requisição DELETE para equipamento: {kwargs.get("pk")}'
        )
        try:
            instance = self.get_object()
            logger.info(f'Equipamento encontrado: {instance}')
            self.perform_destroy(instance)
            logger.info('Equipamento excluído com sucesso')
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Equipment.DoesNotExist:
            logger.error(f'Equipamento não encontrado: {kwargs.get("pk")}')
            return Response(
                {'error': 'Equipamento não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f'Erro ao excluir equipamento: {str(e)}')
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
