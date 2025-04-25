from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_active')
    list_filter = ('user_type', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'department', 'position')
    ordering = ('username',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Informações Pessoais'), {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        (_('Informações Profissionais'), {
            'fields': ('user_type', 'department', 'position')
        }),
        (_('Permissões'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        (_('Datas Importantes'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'user_type'),
        }),
    )
