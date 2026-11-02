from django.urls import path, include
from rest_framework.routers import DefaultRouter

# from .viewsets import GestionVehicularMediaViewSet

router = DefaultRouter()

# router.register(r'gestion-vehicular', GestionVehicularMediaViewSet, basename='gestion-vehicular')

urlpatterns = [
    path('', include(router.urls)),
]