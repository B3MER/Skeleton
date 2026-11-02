from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .viewsets import (
    NacionViewSet,
    EstadoViewSet,
    MunicipioViewSet,
    ColoniaViewSet,
    ZonaViewSet,
    CodigoPostalViewSet,
    ColorViewSet,
)

router = DefaultRouter()

router.register(r'nacion', NacionViewSet, basename='nacion')
router.register(r'estado', EstadoViewSet, basename='estado')
router.register(r'municipio', MunicipioViewSet, basename='municipio')
router.register(r'colonia', ColoniaViewSet, basename='colonia')
router.register(r'zona', ZonaViewSet, basename='zona')
router.register(r'codigo_postal', CodigoPostalViewSet, basename='codigo_postal')
router.register(r'color', ColorViewSet, basename='color')

urlpatterns = [
    path('', include(router.urls)),
]
