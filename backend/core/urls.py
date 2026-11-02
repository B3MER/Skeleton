"""
URL configuration for control_registros project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

api_patterns = [
    path('registros/', include('Registros.urls')),
    path('catalogos/', include('Catalogos.urls')),
    path('media/', include('Media.urls')),
    # autenticaciones
    path('usuarios/', include('Usuarios.urls')),
]

urlpatterns = [
    # OpenAPI / Documentación
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    #aplicaciones
    path('api/v1/', include(api_patterns)),
    #Este es para la pagina DJRF solo dekarlo activo en desarrollo
    path('admin/', admin.site.urls),
    # path('api-auth/', include('rest_framework.urls')),
    # path('__debug__/', include('debug_toolbar.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
