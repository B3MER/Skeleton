from rest_framework import serializers
from .models import MediaVehiculo #, GaleriaVehiculo

##------------ PLANTILLAS ------------##

class MediaSerializer(serializers.ModelSerializer):
    archivo = serializers.FileField(write_only=True)
    class Meta:
        exclude = ('created_at', 'update_at')
        read_only_fields = ['ruta']


##------------ Unidades ------------##

class MediaVehiculoSerializer(MediaSerializer):
    class Meta(MediaSerializer.Meta):
        model = MediaVehiculo

# class GaleriaVehiculoSerializer(serializers.ModelSerializer):
#     media = MediaVehiculoSerializer(read_only=True)
#     class Meta:
#         model = GaleriaVehiculo
#         fields = ['media']
