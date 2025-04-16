from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Equipment
from .serializers import EquipmentSerializer

# Create your views here.

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'serial_number', 'model', 'manufacturer', 'location']
    ordering_fields = ['name', 'status', 'created_at', 'updated_at']
    ordering = ['name']
