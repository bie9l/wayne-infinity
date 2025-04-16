from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'type', 'model', 'manufacturer', 'year',
            'license_plate', 'vin', 'status', 'mileage', 'fuel_type',
            'last_maintenance', 'next_maintenance', 'notes', 'color',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 