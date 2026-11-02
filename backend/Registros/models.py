from django.db import models
from django.utils.translation import gettext_lazy as _
from Helpers.mixinModelos import Plantilla


# =====================================================================
# REGISTRO DE MUESTRA (PLANTILLA PARA NUEVOS MÓDULOS OPERATIVOS)
# =====================================================================

class RegistroEjemplo(Plantilla):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=50, default="ACTIVO")

    class Meta(Plantilla.Meta):
        verbose_name = _("Registro Ejemplo")
        verbose_name_plural = _("Registros Ejemplo")

    def __str__(self):
        return self.titulo
