from rest_framework import permissions
from django.utils.translation import gettext_lazy as _


class IsAdminOrSecurityAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_security_access()


class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_manager_access()


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_admin_access()


# Permissões de Usuários
USER_PERMISSIONS = {
    'view_user': _('Visualizar usuário'),
    'add_user': _('Adicionar usuário'),
    'change_user': _('Alterar usuário'),
    'delete_user': _('Excluir usuário'),
}

# Permissões de Veículos
VEHICLE_PERMISSIONS = {
    'view_vehicle': _('Visualizar veículo'),
    'add_vehicle': _('Adicionar veículo'),
    'change_vehicle': _('Alterar veículo'),
    'delete_vehicle': _('Excluir veículo'),
}

# Permissões de Equipamentos
EQUIPMENT_PERMISSIONS = {
    'view_equipment': _('Visualizar equipamento'),
    'add_equipment': _('Adicionar equipamento'),
    'change_equipment': _('Alterar equipamento'),
    'delete_equipment': _('Excluir equipamento'),
}

# Permissões de Dispositivos
DEVICE_PERMISSIONS = {
    'view_device': _('Visualizar dispositivo'),
    'add_device': _('Adicionar dispositivo'),
    'change_device': _('Alterar dispositivo'),
    'delete_device': _('Excluir dispositivo'),
}

# Permissões de Segurança
SECURITY_PERMISSIONS = {
    'view_security_log': _('Visualizar log de segurança'),
    'add_security_log': _('Adicionar log de segurança'),
    'view_security_alert': _('Visualizar alerta de segurança'),
    'add_security_alert': _('Adicionar alerta de segurança'),
    'change_security_alert': _('Alterar alerta de segurança'),
    'delete_security_alert': _('Excluir alerta de segurança'),
}

# Permissões de Áreas Restritas
RESTRICTED_AREA_PERMISSIONS = {
    'view_restricted_area': _('Visualizar área restrita'),
    'add_restricted_area': _('Adicionar área restrita'),
    'change_restricted_area': _('Alterar área restrita'),
    'delete_restricted_area': _('Excluir área restrita'),
    'access_restricted_area': _('Acessar área restrita'),
}

# Todas as permissões
ALL_PERMISSIONS = {
    **USER_PERMISSIONS,
    **VEHICLE_PERMISSIONS,
    **EQUIPMENT_PERMISSIONS,
    **DEVICE_PERMISSIONS,
    **SECURITY_PERMISSIONS,
    **RESTRICTED_AREA_PERMISSIONS,
}

# Papéis e suas permissões
ROLES = {
    'employee': [
        'view_vehicle',
        'view_equipment',
        'view_device',
        'view_security_log',
        'view_security_alert',
        'view_restricted_area',
    ],
    'manager': [
        'view_user',
        'view_vehicle',
        'add_vehicle',
        'change_vehicle',
        'view_equipment',
        'add_equipment',
        'change_equipment',
        'view_device',
        'add_device',
        'change_device',
        'view_security_log',
        'add_security_log',
        'view_security_alert',
        'add_security_alert',
        'change_security_alert',
        'view_restricted_area',
        'access_restricted_area',
    ],
    'security_admin': [
        'view_user',
        'add_user',
        'change_user',
        'view_vehicle',
        'add_vehicle',
        'change_vehicle',
        'delete_vehicle',
        'view_equipment',
        'add_equipment',
        'change_equipment',
        'delete_equipment',
        'view_device',
        'add_device',
        'change_device',
        'delete_device',
        'view_security_log',
        'add_security_log',
        'view_security_alert',
        'add_security_alert',
        'change_security_alert',
        'delete_security_alert',
        'view_restricted_area',
        'add_restricted_area',
        'change_restricted_area',
        'delete_restricted_area',
        'access_restricted_area',
    ],
    'admin': list(ALL_PERMISSIONS.keys()),
} 