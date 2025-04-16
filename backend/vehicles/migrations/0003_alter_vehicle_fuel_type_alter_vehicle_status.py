# Generated by Django 4.2.10 on 2025-04-16 01:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0002_alter_vehicle_options_vehicle_color_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicle',
            name='fuel_type',
            field=models.CharField(choices=[('GASOLINE', 'Gasolina'), ('ETHANOL', 'Etanol'), ('DIESEL', 'Diesel'), ('FLEX', 'Flex'), ('ELECTRIC', 'Elétrico'), ('HYBRID', 'Híbrido')], default='FLEX', max_length=20, verbose_name='Tipo de Combustível'),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='status',
            field=models.CharField(choices=[('ACTIVE', 'Ativo'), ('MAINTENANCE', 'Em Manutenção'), ('INACTIVE', 'Inativo')], default='ACTIVE', max_length=20, verbose_name='Status'),
        ),
    ]
