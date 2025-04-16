from django.db import models
from django.utils.translation import gettext_lazy as _

class Equipment(models.Model):
    STATUS_CHOICES = [
        ('available', _('Disponível')),
        ('in_use', _('Em Uso')),
        ('maintenance', _('Em Manutenção')),
        ('retired', _('Aposentado')),
    ]

    EQUIPMENT_TYPES = [
        ('tool', _('Ferramenta')),
        ('machine', _('Máquina')),
        ('safety', _('Equipamento de Segurança')),
        ('electronic', _('Equipamento Eletrônico')),
        ('other', _('Outro')),
    ]

    name = models.CharField(_('Nome'), max_length=100)
    type = models.CharField(_('Tipo'), max_length=20, choices=EQUIPMENT_TYPES)
    model = models.CharField(_('Modelo'), max_length=100)
    manufacturer = models.CharField(_('Fabricante'), max_length=100)
    serial_number = models.CharField(_('Número de Série'), max_length=50, unique=True)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='available')
    purchase_date = models.DateField(_('Data de Compra'), null=True, blank=True)
    warranty_expiry = models.DateField(_('Fim da Garantia'), null=True, blank=True)
    last_maintenance = models.DateField(_('Última Manutenção'), null=True, blank=True)
    next_maintenance = models.DateField(_('Próxima Manutenção'), null=True, blank=True)
    location = models.CharField(_('Localização'), max_length=100)
    notes = models.TextField(_('Observações'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Equipamento')
        verbose_name_plural = _('Equipamentos')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.serial_number}"
