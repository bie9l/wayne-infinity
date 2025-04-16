from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Device
from .serializers import DeviceSerializer

# Create your views here.

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['type', 'status', 'os']
    search_fields = ['name', 'serial_number', 'ip_address', 'mac_address', 'assigned_to', 'location']
    ordering_fields = ['name', 'status', 'created_at', 'updated_at']
    ordering = ['name']
