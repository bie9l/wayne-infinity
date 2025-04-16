from django.contrib import admin
from django.contrib.auth.models import User, Group
from knox.models import AuthToken
from vehicles.models import Vehicle
from equipment.models import Equipment
from devices.models import Device
from security.models import SecurityAlert

# Desregistrando modelos que não queremos no admin
admin.site.unregister(Group)  # Desregistra o modelo Group padrão se não for necessário

# Registrando os modelos que queremos no admin
admin.site.register(Vehicle)
admin.site.register(Equipment)
admin.site.register(Device)
admin.site.register(SecurityAlert)
admin.site.register(AuthToken) 