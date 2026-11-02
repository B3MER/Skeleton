import django_filters


class CatalogoFilter(django_filters.FilterSet):
    descripcion = django_filters.CharFilter(
        field_name="descripcion",
        lookup_expr="icontains"
    )

    class Meta:
        fields = ["descripcion", 'id']


class CodigoPostalFilter(django_filters.FilterSet):
    codigo_postal = django_filters.CharFilter(
        field_name='codigo_postal',
        lookup_expr="icontains"
    )
    colonia = django_filters.NumberFilter(field_name='colonia__id')

    class Meta:
        fields = ["id", 'municipio', "zona"]
