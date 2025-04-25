from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Validação personalizada para garantir que os dados estejam corretos.
        """
        # Garante que as datas são None se não forem fornecidas
        if 'last_maintenance' not in data:
            data['last_maintenance'] = None
        if 'next_maintenance' not in data:
            data['next_maintenance'] = None

        print("Dados recebidos após validação:", data)  # Debug
        return data

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'type', 'model', 'manufacturer', 'year',
            'license_plate', 'vin', 'status', 'mileage', 'fuel_type',
            'last_maintenance', 'next_maintenance', 'notes', 'color',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 