from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Role(models.Model):
    name = models.CharField(_('Nome'), max_length=100, unique=True)
    description = models.TextField(_('Descrição'), blank=True)
    permissions = models.ManyToManyField(
        'Permission',
        verbose_name=_('Permissões')
    )
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Papel')
        verbose_name_plural = _('Papéis')
        ordering = ['name']

    def __str__(self):
        return self.name


class Permission(models.Model):
    name = models.CharField(_('Nome'), max_length=100, unique=True)
    codename = models.CharField(_('Código'), max_length=100, unique=True)
    description = models.TextField(_('Descrição'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Permissão')
        verbose_name_plural = _('Permissões')
        ordering = ['name']

    def __str__(self):
        return self.name


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('employee', _('Funcionário')),
        ('manager', _('Gerente')),
        ('security_admin', _('Administrador de Segurança')),
        ('admin', _('Administrador')),
    ]

    user_type = models.CharField(
        _('Tipo de Usuário'),
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='employee'
    )
    department = models.CharField(
        _('Departamento'),
        max_length=100,
        blank=True
    )
    position = models.CharField(_('Cargo'), max_length=100, blank=True)
    phone = models.CharField(_('Telefone'), max_length=20, blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    roles = models.ManyToManyField(Role, verbose_name=_('Papéis'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    # Adicionando related_name para resolver conflitos
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('Grupos'),
        blank=True,
        related_name='custom_user_set',
        help_text=_(
            'Os grupos aos quais este usuário pertence. Um usuário terá todas as permissões concedidas a cada um de seus grupos.'
        ),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('Permissões de usuário'),
        blank=True,
        related_name='custom_user_set',
        help_text=_('Permissões específicas para este usuário.'),
    )

    class Meta:
        verbose_name = _('Usuário')
        verbose_name_plural = _('Usuários')
        ordering = ['username']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"

    def has_security_access(self):
        return self.user_type in ['security_admin', 'admin']

    def has_manager_access(self):
        return self.user_type in ['manager', 'security_admin', 'admin']

    def has_admin_access(self):
        return self.user_type == 'admin'

    def has_permission(self, permission_codename):
        return self.roles.filter(
            permissions__codename=permission_codename
        ).exists()

    def get_all_permissions(self):
        permissions = set()
        for role in self.roles.all():
            permissions.update(role.permissions.all())
        return permissions
