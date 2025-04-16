from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Device

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'model', 'serial_number', 'status', 'ip_address', 'assigned_to')
    list_filter = ('type', 'status', 'os')
    search_fields = ('name', 'serial_number', 'ip_address', 'mac_address', 'assigned_to', 'location')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Informações Básicas'), {
            'fields': ('name', 'type', 'model', 'manufacturer')
        }),
        (_('Identificação'), {
            'fields': ('serial_number', 'location', 'assigned_to')
        }),
        (_('Rede'), {
            'fields': ('ip_address', 'mac_address')
        }),
        (_('Sistema'), {
            'fields': ('os', 'os_version')
        }),
        (_('Status e Manutenção'), {
            'fields': ('status', 'purchase_date', 'warranty_expiry', 'last_maintenance')
        }),
        (_('Observações'), {
            'fields': ('notes',)
        }),
        (_('Informações do Sistema'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
