from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import SecurityIncident, SecurityLog

@admin.register(SecurityIncident)
class SecurityIncidentAdmin(admin.ModelAdmin):
    list_display = ('title', 'severity', 'status', 'reported_by', 'reported_at', 'location')
    list_filter = ('severity', 'status')
    search_fields = ('title', 'description', 'reported_by', 'location', 'affected_assets')
    readonly_fields = ('reported_at', 'created_at', 'updated_at')
    fieldsets = (
        (_('Informações Básicas'), {
            'fields': ('title', 'description', 'severity', 'status')
        }),
        (_('Detalhes do Incidente'), {
            'fields': ('reported_by', 'reported_at', 'location', 'affected_assets')
        }),
        (_('Resolução'), {
            'fields': ('resolution', 'resolved_at', 'resolved_by')
        }),
        (_('Observações'), {
            'fields': ('notes',)
        }),
        (_('Informações do Sistema'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(SecurityLog)
class SecurityLogAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'user', 'ip_address', 'created_at')
    list_filter = ('event_type',)
    search_fields = ('description', 'user', 'ip_address', 'device_id', 'location')
    readonly_fields = ('created_at',)
    fieldsets = (
        (_('Informações do Evento'), {
            'fields': ('event_type', 'description', 'user')
        }),
        (_('Detalhes Técnicos'), {
            'fields': ('ip_address', 'device_id', 'location')
        }),
        (_('Informações do Sistema'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
