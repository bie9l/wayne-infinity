from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'model', 'manufacturer', 'license_plate', 'status')
    list_filter = ('type', 'status', 'fuel_type')
    search_fields = ('name', 'license_plate', 'vin', 'model', 'manufacturer')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Informações Básicas'), {
            'fields': ('name', 'type', 'model', 'manufacturer', 'year')
        }),
        (_('Identificação'), {
            'fields': ('license_plate', 'vin')
        }),
        (_('Status e Manutenção'), {
            'fields': ('status', 'mileage', 'fuel_type', 'last_maintenance', 'next_maintenance')
        }),
        (_('Observações'), {
            'fields': ('notes',)
        }),
        (_('Informações do Sistema'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
