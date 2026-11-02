from django.db import models
from django.utils.translation import gettext_lazy as _
from Helpers.mixinModelos import Plantilla

# =====================================================================
# NIVEL 1: CATÁLOGOS BASE / GEOGRÁFICOS Y DEMOGRÁFICOS
# (Universales, inertes y altamente compartidos)
# =====================================================================

class Nacion(Plantilla):
    descripcion = models.CharField(max_length=100, unique=True)

    class Meta(Plantilla.Meta):
        verbose_name = _("Nacion")
        verbose_name_plural = _("Naciones")

    def __str__(self):
        return self.descripcion

class Estado(Plantilla):
    descripcion = models.CharField(max_length=100, unique=True)

    class Meta(Plantilla.Meta):
        verbose_name = _("Estado")
        verbose_name_plural = _("Estados")

    def __str__(self):
        return self.descripcion

class Municipio(Plantilla):
    descripcion = models.CharField(max_length=100, unique=True)
    estado = models.ForeignKey(Estado, related_name="municipios", on_delete=models.CASCADE, null=True)

    class Meta(Plantilla.Meta):
        verbose_name = _("Municipio")
        verbose_name_plural = _("Municipios")
        unique_together = ('descripcion', 'estado')

    def __str__(self):
        return self.descripcion

class Colonia(Plantilla):
    descripcion = models.CharField(max_length=100)

    class Meta(Plantilla.Meta):
        verbose_name = _("Colonia")
        verbose_name_plural = _("Colonias")

    def __str__(self):
        return self.descripcion

class Zona(Plantilla):
    descripcion = models.CharField(max_length=100, unique=True)

    class Meta(Plantilla.Meta):
        verbose_name = _("Zona")
        verbose_name_plural = _("Zonas")

    def __str__(self):
        return self.descripcion

class CodigoPostal(Plantilla):
    codigo_postal = models.CharField(max_length=5)
    estado = models.ForeignKey(Estado, related_name='codigos_postales', on_delete=models.CASCADE)
    municipio = models.ForeignKey(Municipio, related_name='codigos_postales', on_delete=models.CASCADE)
    colonia = models.ForeignKey(Colonia, related_name="codigos_postales", on_delete=models.CASCADE)
    colonia_tipo = models.CharField(max_length=50)
    zona = models.ForeignKey(Zona, related_name='codigos_postales', on_delete=models.CASCADE)
    
    class Meta(Plantilla.Meta):
        verbose_name = _("Codigo Postal")
        verbose_name_plural = _("Codigos Postales")
        
    def __str__(self):
        return f"{self.codigo_postal} - {self.colonia}, {self.municipio}, {self.estado}"


# =====================================================================
# NIVEL 2: CATÁLOGOS DE BIENES (VEHÍCULOS Y PROPIEDADES)
# (Comunes en múltiples módulos)
# =====================================================================

class Color(Plantilla):
    descripcion = models.CharField(max_length=50, unique=True)

    class Meta(Plantilla.Meta):
        verbose_name = _("Color")
        verbose_name_plural = _("Colores")

    def __str__(self):
        return self.descripcion
