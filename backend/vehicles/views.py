from rest_framework import generics, permissions
from .models import Vehicle
from .serializers import VehicleSerializer
from users.permissions import IsAdminOrManager

# Create your views here.

class VehicleListCreateView(generics.ListCreateAPIView):
    """
    API endpoint que permite listar e criar veículos.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsAdminOrManager()]

    filterset_fields = ['type', 'status', 'fuel_type']
    search_fields = ['name', 'license_plate', 'vin', 'model', 'manufacturer']
    ordering_fields = ['name', 'status', 'mileage', 'created_at', 'updated_at']
    ordering = ['name']

    def get_queryset(self):
        """
        Opcionalmente filtra o conjunto de resultados com base em parâmetros da URL
        """
        queryset = Vehicle.objects.all()
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset

class VehicleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint que permite visualizar, atualizar e deletar um veículo específico.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsAdminOrManager()]
