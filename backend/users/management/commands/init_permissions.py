from django.core.management.base import BaseCommand
from django.utils.translation import gettext_lazy as _
from users.models import Permission, Role
from users.permissions import ALL_PERMISSIONS, ROLES


class Command(BaseCommand):
    help = 'Inicializa as permissões e papéis no banco de dados'

    def handle(self, *args, **options):
        self.stdout.write('Criando permissões...')
        
        # Criar permissões
        for codename, name in ALL_PERMISSIONS.items():
            Permission.objects.get_or_create(
                codename=codename,
                defaults={
                    'name': name,
                    'description': name,
                }
            )
        
        self.stdout.write(self.style.SUCCESS('Permissões criadas com sucesso!'))
        
        # Criar papéis
        self.stdout.write('Criando papéis...')
        
        for role_name, permissions in ROLES.items():
            role, created = Role.objects.get_or_create(
                name=role_name,
                defaults={
                    'description': _(f'Papel de {role_name}'),
                }
            )
            
            # Adicionar permissões ao papel
            role.permissions.clear()
            for permission_codename in permissions:
                permission = Permission.objects.get(codename=permission_codename)
                role.permissions.add(permission)
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Papel "{role_name}" criado com sucesso!')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'Papel "{role_name}" atualizado com sucesso!')
                )
        
        self.stdout.write(self.style.SUCCESS('Papéis criados com sucesso!')) 