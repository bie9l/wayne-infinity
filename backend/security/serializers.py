from rest_framework import serializers
from .models import SecurityIncident, SecurityLog

class SecurityIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityIncident
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'reported_at')

class SecurityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityLog
        fields = '__all__'
        read_only_fields = ('created_at',) 