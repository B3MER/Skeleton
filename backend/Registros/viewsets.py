from Helpers.mixinsDJRF import TemplateViewset
from .models import RegistroEjemplo
from .serializers import RegistroEjemploSerializer


class RegistroEjemploViewSet(TemplateViewset):
    model = RegistroEjemplo
    queryset = RegistroEjemplo.objects.all()
    serializer_class = RegistroEjemploSerializer
