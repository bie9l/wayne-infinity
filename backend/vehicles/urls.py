from django.urls import path
from .views import (
    VehicleListCreateView,
    VehicleRetrieveUpdateDestroyView
)

urlpatterns = [
    path('', VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('<int:pk>/', VehicleRetrieveUpdateDestroyView.as_view(), name='vehicle-detail'),
] 