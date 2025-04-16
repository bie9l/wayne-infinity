from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Equipment

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'model', 'serial_number', 'status', 'location')
    list_filter = ('type', 'status')
    search_fields = ('name', 'serial_number', 'model', 'manufacturer', 'location')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (_('Informações Básicas'), {
            'fields': ('name', 'type', 'model', 'manufacturer')
        }),
        (_('Identificação'), {
            'fields': ('serial_number', 'location')
        }),
        (_('Status e Manutenção'), {
            'fields': ('status', 'purchase_date', 'warranty_expiry', 'last_maintenance', 'next_maintenance')
        }),
        (_('Observações'), {
            'fields': ('notes',)
        }),
        (_('Informações do Sistema'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
