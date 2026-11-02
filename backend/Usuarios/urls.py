from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView,LogoutView
from .viewsets import PermisosViewSet,GrupoViewSet,RegistroViewSet

router = DefaultRouter()
router.register(r'permisos', PermisosViewSet, basename='permisos')
router.register(r'grupos', GrupoViewSet, basename='grupos')
router.register(r'profile', RegistroViewSet, basename='profile')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]