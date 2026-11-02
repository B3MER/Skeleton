from django.db import models
from django.contrib.auth.models import User

class Plantilla(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ['-update_at', '-id']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class UbicacionMixin(models.Model):
    direccion = models.CharField(max_length=255, blank=True, null=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    class Meta:
        abstract = True