from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import RegistroEjemploViewSet

router = DefaultRouter()
router.register(r'ejemplo', RegistroEjemploViewSet, basename='ejemplo')

urlpatterns = [
    path('', include(router.urls)),
]

websocket_urlpatterns = []
