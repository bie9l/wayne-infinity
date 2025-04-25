from django.db import models
from django.utils.translation import gettext_lazy as _

class Vehicle(models.Model):
    FUEL_CHOICES = [
        ('GASOLINE', 'Gasolina'),
        ('ETHANOL', 'Etanol'),
        ('DIESEL', 'Diesel'),
        ('FLEX', 'Flex'),
        ('ELECTRIC', 'Elétrico'),
        ('HYBRID', 'Híbrido')
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Ativo'),
        ('MAINTENANCE', 'Em Manutenção'),
        ('INACTIVE', 'Inativo')
    ]

    VEHICLE_TYPES = [
        ('car', _('Carro')),
        ('motorcycle', _('Motocicleta')),
        ('truck', _('Caminhão')),
        ('van', _('Van')),
        ('other', _('Outro')),
    ]

    name = models.CharField(_('Nome'), max_length=100)
    type = models.CharField(_('Tipo'), max_length=20, choices=VEHICLE_TYPES)
    model = models.CharField(_('Modelo'), max_length=100)
    manufacturer = models.CharField(_('Fabricante'), max_length=100)
    year = models.IntegerField(_('Ano'))
    license_plate = models.CharField(_('Placa'), max_length=20, unique=True)
    vin = models.CharField(_('Número do Chassi'), max_length=100, unique=True)
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    mileage = models.IntegerField(_('Quilometragem'))
    fuel_type = models.CharField(
        _('Tipo de Combustível'),
        max_length=20,
        choices=FUEL_CHOICES,
        default='FLEX'
    )
    last_maintenance = models.DateField(_('Última Manutenção'), null=True, blank=True)
    next_maintenance = models.DateField(_('Próxima Manutenção'), null=True, blank=True)
    notes = models.TextField(_('Observações'), blank=True)
    color = models.CharField(_('Cor'), max_length=50)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Veículo')
        verbose_name_plural = _('Veículos')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.license_plate} - {self.model} ({self.manufacturer})"
