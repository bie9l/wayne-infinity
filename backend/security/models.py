from django.db import models
from django.utils.translation import gettext_lazy as _

class SecurityIncident(models.Model):
    SEVERITY_CHOICES = [
        ('low', _('Baixa')),
        ('medium', _('Média')),
        ('high', _('Alta')),
        ('critical', _('Crítica')),
    ]

    STATUS_CHOICES = [
        ('open', _('Aberto')),
        ('investigating', _('Em Investigação')),
        ('resolved', _('Resolvido')),
        ('closed', _('Fechado')),
    ]

    title = models.CharField(_('Título'), max_length=200)
    description = models.TextField(_('Descrição'))
    severity = models.CharField(_('Severidade'), max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='open')
    reported_by = models.CharField(_('Reportado por'), max_length=100)
    reported_at = models.DateTimeField(_('Reportado em'), auto_now_add=True)
    location = models.CharField(_('Local'), max_length=100)
    affected_assets = models.TextField(_('Ativos Afetados'))
    resolution = models.TextField(_('Resolução'), blank=True)
    resolved_at = models.DateTimeField(_('Resolvido em'), null=True, blank=True)
    resolved_by = models.CharField(_('Resolvido por'), max_length=100, blank=True)
    notes = models.TextField(_('Observações'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Incidente de Segurança')
        verbose_name_plural = _('Incidentes de Segurança')
        ordering = ['-reported_at']

    def __str__(self):
        return f"{self.title} - {self.severity} ({self.status})"


class SecurityLog(models.Model):
    EVENT_TYPES = [
        ('access', _('Acesso')),
        ('alert', _('Alerta')),
        ('violation', _('Violação')),
        ('system', _('Sistema')),
        ('other', _('Outro')),
    ]

    event_type = models.CharField(_('Tipo de Evento'), max_length=20, choices=EVENT_TYPES)
    description = models.TextField(_('Descrição'))
    user = models.CharField(_('Usuário'), max_length=100)
    ip_address = models.GenericIPAddressField(_('Endereço IP'))
    device_id = models.CharField(_('ID do Dispositivo'), max_length=100, blank=True)
    location = models.CharField(_('Local'), max_length=100, blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)

    class Meta:
        verbose_name = _('Log de Segurança')
        verbose_name_plural = _('Logs de Segurança')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type} - {self.user} - {self.created_at}"
