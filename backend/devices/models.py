from django.db import models
from django.utils.translation import gettext_lazy as _

class Device(models.Model):
    STATUS_CHOICES = [
        ('active', _('Ativo')),
        ('inactive', _('Inativo')),
        ('maintenance', _('Em Manutenção')),
        ('retired', _('Aposentado')),
    ]

    DEVICE_TYPES = [
        ('mobile', _('Dispositivo Móvel')),
        ('desktop', _('Computador Desktop')),
        ('laptop', _('Notebook')),
        ('tablet', _('Tablet')),
        ('printer', _('Impressora')),
        ('network', _('Equipamento de Rede')),
        ('other', _('Outro')),
    ]

    name = models.CharField(_('Nome'), max_length=100)
    type = models.CharField(_('Tipo'), max_length=20, choices=DEVICE_TYPES)
    model = models.CharField(_('Modelo'), max_length=100)
    manufacturer = models.CharField(_('Fabricante'), max_length=100)
    serial_number = models.CharField(_('Número de Série'), max_length=50, unique=True)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='active')
    ip_address = models.GenericIPAddressField(_('Endereço IP'), null=True, blank=True)
    mac_address = models.CharField(_('Endereço MAC'), max_length=17, blank=True)
    os = models.CharField(_('Sistema Operacional'), max_length=50, blank=True)
    os_version = models.CharField(_('Versão do SO'), max_length=50, blank=True)
    purchase_date = models.DateField(_('Data de Compra'), null=True, blank=True)
    warranty_expiry = models.DateField(_('Fim da Garantia'), null=True, blank=True)
    last_maintenance = models.DateField(_('Última Manutenção'), null=True, blank=True)
    assigned_to = models.CharField(_('Atribuído a'), max_length=100, blank=True)
    location = models.CharField(_('Localização'), max_length=100)
    notes = models.TextField(_('Observações'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Dispositivo')
        verbose_name_plural = _('Dispositivos')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.serial_number}"
