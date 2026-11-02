from django.db import models
from Helpers.mixinModelos import Plantilla

##------------ PLANTILLAS ------------##
class MediaPlantilla(Plantilla):
    nombre = models.CharField(max_length=250)
    ruta = models.CharField(max_length=500)
    class Meta(Plantilla.Meta):
        abstract = True

    def __str__(self):
        return f"{self.nombre} ({self.ruta})"

##------------ MODELOS ------------##

class MediaVehiculo(MediaPlantilla):
    pass

class MediaGuardia(MediaPlantilla):
    pass

class MediaConductor(MediaPlantilla):
    pass

class MediaDesignado(MediaPlantilla):
    pass

##------------ GALERIA [INTERMEDIAS] ------------##

# class GaleriaVehiculo(Plantilla):
#     parent = models.ForeignKey(Vehiculo, unique=True, on_delete=models.CASCADE, related_name='media_unidad')
#     media = models.ForeignKey(MediaVehiculo,unique=True, on_delete=models.CASCADE)
#     pass

