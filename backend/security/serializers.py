from rest_framework import serializers
from .models import SecurityIncident, SecurityLog
import logging

logger = logging.getLogger(__name__)

class SecurityIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityIncident
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'reported_at')

class SecurityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityLog
        fields = '__all__'
        read_only_fields = ('created_at',)

    def validate(self, data):
        logger.info(f'Validando dados do log: {data}')
        # Remover campos vazios ou nulos
        for field in list(data.keys()):
            if data[field] in [None, '', []]:
                del data[field]
        return data

    def create(self, validated_data):
        logger.info(f'Criando log com dados validados: {validated_data}')
        try:
            instance = super().create(validated_data)
            logger.info(f'Log criado com sucesso: {instance}')
            return instance
        except Exception as e:
            logger.error(f'Erro ao criar log: {str(e)}')
            raise 