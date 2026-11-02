from rest_framework import serializers
from django.conf import settings
from Helpers.validators import solo_media
import os


class MediaSerializerMixinR:
    """
    Añade automáticamente el campo 'media' 
    con su lógica de resolución de URLs.
    """
    def __init__(self, *args, **kwargs):
        self.fields['media'] = serializers.SerializerMethodField() #type:ignore
        super().__init__(*args, **kwargs)

    def get_media(self, obj):
        request = self.context.get('request') #type:ignore
        archivos = obj.media.all()
        
        lista_media = []
        for archivo in archivos:
            ruta_respaldo = f"{settings.MEDIA_URL}helper/document-missing.svg/"
            ruta_fisica = os.path.join(settings.MEDIA_ROOT, archivo.ruta) 
            error = False

            if os.path.exists(ruta_fisica):
                ruta_relativa = f"{settings.MEDIA_URL}{archivo.ruta}"
            else:
                ruta_relativa = ruta_respaldo
                error = True

            full_url = request.build_absolute_uri(ruta_relativa) if request else ruta_relativa
            
            lista_media.append({
                "id": archivo.id,
                "nombre": archivo.nombre,
                "ruta": full_url,
                "error": error,
            })
        return lista_media
    
class MediaSerializerMixinCU(serializers.Serializer):
    """Añade los campos necesarios para la subida de media (Solo Escritura)."""
    media = serializers.FileField(write_only=True, required=False)
    media_nombre = serializers.CharField(write_only=True, required=False)
    ext_media = None

    def validate_media(self, value):
        solo_media(value, self.ext_media)
        return value