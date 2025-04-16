from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SecurityIncident, SecurityLog
from .serializers import SecurityIncidentSerializer, SecurityLogSerializer

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
