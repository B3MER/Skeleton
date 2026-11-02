from rest_framework import serializers
from .models import RegistroEjemplo


class RegistroEjemploSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroEjemplo
        fields = '__all__'
        read_only_fields = ('usuario',)

    def get_fields(self):
        fields = super().get_fields()
        fields.pop('created_at', None)
        fields.pop('update_at', None)
        return fields
