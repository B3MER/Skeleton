from rest_framework.pagination import PageNumberPagination

class PaginacionPequena(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 25

class PaginacionMediana(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class PaginacionGrande(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 500
