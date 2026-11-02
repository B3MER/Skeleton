from rest_framework import serializers
from .models import (
    Nacion,
    Estado,
    Municipio,
    Colonia,
    Zona,
    CodigoPostal,
    Color,
)
from Helpers.validators import solo_letras, letras_y_numeros, solo_numeros


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('usuario',)

    def get_fields(self):
        fields = super().get_fields()
        fields.pop('created_at', None)
        fields.pop('update_at', None)
        return fields


# =====================================================================
# DEMOGRÁFICOS Y GEOGRÁFICOS
# =====================================================================

class NacionSerializer(TemplateSerializer):
    class Meta(TemplateSerializer.Meta):
        model = Nacion
        fields = '__all__'

    def validate_descripcion(self, value):
        solo_letras(value)
        return value


class EstadoSerializer(TemplateSerializer):
    class Meta(TemplateSerializer.Meta):
        model = Estado
        fields = '__all__'

    def validate_descripcion(self, value):
        letras_y_numeros(value)
        return value


# ---------------------- Municipio ----------------------

class MunicipioSerializerCU(TemplateSerializer):
    estado = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all())

    class Meta(TemplateSerializer.Meta):
        model = Municipio
        fields = '__all__'

    def validate_descripcion(self, value):
        letras_y_numeros(value)
        return value


class MunicipioSerializerR(TemplateSerializer):
    estado = EstadoSerializer(read_only=True)

    class Meta(TemplateSerializer.Meta):
        model = Municipio
        fields = '__all__'

    def validate_descripcion(self, value):
        letras_y_numeros(value)
        return value


# ---------------------- Colonia y Zona ----------------------

class ColoniaSerializer(TemplateSerializer):
    class Meta(TemplateSerializer.Meta):
        model = Colonia
        fields = '__all__'

    def validate_descripcion(self, value):
        letras_y_numeros(value)
        return value


class ZonaSerializer(TemplateSerializer):
    class Meta(TemplateSerializer.Meta):
        model = Zona
        fields = '__all__'

    def validate_descripcion(self, value):
        letras_y_numeros(value)
        return value


# ---------------------- Código Postal ----------------------

class CodigoPostalSerializerCU(TemplateSerializer):
    estado = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all())
    municipio = serializers.PrimaryKeyRelatedField(queryset=Municipio.objects.all())
    zona = serializers.PrimaryKeyRelatedField(queryset=Zona.objects.all())
    colonia = serializers.PrimaryKeyRelatedField(queryset=Colonia.objects.all())

    class Meta(TemplateSerializer.Meta):
        model = CodigoPostal
        fields = '__all__'

    def validate_codigo_postal(self, value):
        solo_numeros(value)
        return value

    def validate_colonia_tipo(self, value):
        solo_letras(value)
        return value


class CodigoPostalSerializerR(TemplateSerializer):
    estado = serializers.StringRelatedField()
    municipio = serializers.StringRelatedField()
    zona = serializers.StringRelatedField()
    colonia = serializers.StringRelatedField()

    class Meta(TemplateSerializer.Meta):
        model = CodigoPostal
        fields = '__all__'


# =====================================================================
# BIENES (VEHÍCULOS Y PROPIEDADES)
# =====================================================================

class ColorSerializer(TemplateSerializer):
    class Meta(TemplateSerializer.Meta):
        model = Color
        fields = '__all__'

    def validate_descripcion(self, value):
        solo_letras(value)
        return value
