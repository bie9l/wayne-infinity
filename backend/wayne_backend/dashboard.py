from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from vehicles.models import Vehicle
from equipment.models import Equipment
from devices.models import Device

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Contagem de veículos por status
        vehicles_count = Vehicle.objects.count()
        vehicles_by_status = {}
        for status in Vehicle.objects.values_list('status', flat=True).distinct():
            vehicles_by_status[status] = Vehicle.objects.filter(status=status).count()

        # Contagem de equipamentos por tipo
        equipment_count = Equipment.objects.count()
        equipment_by_type = {}
        for type in Equipment.objects.values_list('type', flat=True).distinct():
            equipment_by_type[type] = Equipment.objects.filter(type=type).count()

        # Contagem de dispositivos por status
        devices_count = Device.objects.count()
        devices_by_status = {}
        for status in Device.objects.values_list('status', flat=True).distinct():
            devices_by_status[status] = Device.objects.filter(status=status).count()

        return Response({
            'summary': {
                'total_vehicles': vehicles_count,
                'total_equipment': equipment_count,
                'total_devices': devices_count,
            },
            'vehicles': {
                'total': vehicles_count,
                'by_status': vehicles_by_status
            },
            'equipment': {
                'total': equipment_count,
                'by_type': equipment_by_type
            },
            'devices': {
                'total': devices_count,
                'by_status': devices_by_status
            }
        }) 