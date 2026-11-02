from Helpers.mixinsDJRF import TemplateViewset
from Helpers.pagination import PaginacionGrande
from .models import (
    Nacion,
    Estado,
    Municipio,
    Colonia,
    Zona,
    CodigoPostal,
    Color,
)
from .serializers import (
    NacionSerializer,
    EstadoSerializer,
    MunicipioSerializerCU,
    MunicipioSerializerR,
    ColoniaSerializer,
    ZonaSerializer,
    CodigoPostalSerializerCU,
    CodigoPostalSerializerR,
    ColorSerializer,
)
from .filters import CatalogoFilter, CodigoPostalFilter


class catalogosFiltros(TemplateViewset):
    filterset_class = CatalogoFilter


class NacionViewSet(catalogosFiltros):
    model = Nacion
    queryset = Nacion.objects.all()
    serializer_class = NacionSerializer


class EstadoViewSet(catalogosFiltros):
    pagination_class = PaginacionGrande
    model = Estado
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer


class MunicipioViewSet(catalogosFiltros):
    model = Municipio
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializerR

    def get_serializer_class(self):
        serial = {
            'list': MunicipioSerializerR,
            'retrieve': MunicipioSerializerR,
            'create': MunicipioSerializerCU,
            'update': MunicipioSerializerCU,
            'partial_update': MunicipioSerializerCU,
        }
        return serial[self.action] if self.action in serial else self.serializer_class

    def get_queryset(self):
        queryset = super().get_queryset()
        estado_id = self.request.query_params.get('estado')
        if estado_id:
            queryset = queryset.filter(estado_id=estado_id)
        return queryset


class ColoniaViewSet(catalogosFiltros):
    model = Colonia
    queryset = Colonia.objects.all()
    serializer_class = ColoniaSerializer


class ZonaViewSet(catalogosFiltros):
    model = Zona
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer


class CodigoPostalViewSet(catalogosFiltros):
    model = CodigoPostal
    queryset = CodigoPostal.objects.all()
    filterset_class = CodigoPostalFilter
    serializer_class = CodigoPostalSerializerR

    def get_serializer_class(self):
        serial = {
            'list': CodigoPostalSerializerR,
            'retrieve': CodigoPostalSerializerR,
            'create': CodigoPostalSerializerCU,
            'update': CodigoPostalSerializerCU,
            'partial_update': CodigoPostalSerializerCU,
        }
        return serial[self.action] if self.action in serial else self.serializer_class


class ColorViewSet(catalogosFiltros):
    model = Color
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
