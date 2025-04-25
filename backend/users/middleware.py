from django.http import HttpResponseForbidden
from django.utils.translation import gettext_lazy as _


class PermissionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verificar se o usuário está autenticado
        if not request.user.is_authenticated:
            return self.get_response(request)

        # Verificar se o usuário tem permissão para acessar a área restrita
        if request.path.startswith('/api/security/areas/'):
            if not request.user.has_permission('access_restricted_area'):
                return HttpResponseForbidden(
                    _('Você não tem permissão para acessar esta área.')
                )

        # Verificar se o usuário tem permissão para acessar a área de segurança
        if request.path.startswith('/api/security/'):
            if not request.user.has_security_access():
                return HttpResponseForbidden(
                    _('Você não tem permissão para acessar esta área.')
                )

        # Verificar se o usuário tem permissão para acessar a área de gerenciamento
        if request.path.startswith('/api/management/'):
            if not request.user.has_manager_access():
                return HttpResponseForbidden(
                    _('Você não tem permissão para acessar esta área.')
                )

        # Verificar se o usuário tem permissão para acessar a área de administração
        if request.path.startswith('/api/admin/'):
            if not request.user.has_admin_access():
                return HttpResponseForbidden(
                    _('Você não tem permissão para acessar esta área.')
                )

        return self.get_response(request) 