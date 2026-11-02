import os
from datetime import datetime
from django.conf import settings
from django.db import IntegrityError, transaction
from rest_framework import viewsets
from rest_framework.exceptions import (PermissionDenied, AuthenticationFailed, NotAuthenticated, ValidationError)
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django_filters.rest_framework import DjangoFilterBackend
from core.authentication import TokenDelete
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status
from django.http import Http404
from .pagination import PaginacionMediana
from django.utils.text import get_valid_filename
from response import (
    bad_request_response,
    created_response,
    forbidden_response,
    internal_error_response,
    # internal_error_response,
    not_found_response,
    no_content_response,
    ok_response,
)

""" 
    Esta seccion es para la modificacion de los permisos
    que vienen por defecto en el viewset y el ordenamiento
    por defecto
"""

class GestorPermissions(DjangoModelPermissions):
    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }
    def has_permission(self, request, view):
        if not request.user or (
           not request.user.is_authenticated and self.authenticated_users_only):
            return False
        if getattr(view, '_ignore_model_permissions', False):
            return True
        if request.user.is_staff:
            return True
        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)

        return request.user.has_perms(perms)

class GestorAutenticacion:
    """
    Autenticacion por defecto
    """
    permission_classes = [IsAuthenticated, GestorPermissions]
    authentication_classes = [TokenDelete]

class GestorOrdenamiento:
    """
    Paginacion y ordenamiento por defecto
    - Ordenamiento por defecto: update_at (dentro de mixinModelos)

    """
    filter_backends = [ DjangoFilterBackend]
    pagination_class = PaginacionMediana


""" 
    Esta seccion esta dedicada para crear los modelos bases 
    para poder usar el response.py (Cambia cada uno de los 
    response de quien lo llame) por lo general este planeo 
    ocuparlos dentro de los viewsets 
    Es obligatorio llamar un queryset
"""

class MediaMixin:
    '''
    MediaMixin es una clase inyectable de la cual intercepta el perform_create()
    siempre y cuando sea declarado:

    - media_folder = FOLDER DE LA CARPETA A GUARDAR LAS IMAGENES
    - media_model  = MODELO DONDE SE GUARDARA LAS IMAGENES
    
    ### El viewset a inyectar debe de contar con: ###

    - Un serializer que cuente con el campo "media"
    - Su propio modelo a guardar la ruta y nombre del archivo a guardar

    '''
    media_folder = None
    media_model = None

    def guardar_archivo(self, archivo_recibido, nombre_ingresado=None, carpeta_padre=None):
        parent_folder = carpeta_padre or self.media_folder
        
        nombre_base_original, ext_original = os.path.splitext(archivo_recibido.name)
        nombre_referencia = nombre_ingresado if nombre_ingresado else nombre_base_original
        nombre_referencia = get_valid_filename(nombre_referencia)

        if not nombre_referencia.lower().endswith(ext_original.lower()):
            nombre_archivo = f"{nombre_referencia}{ext_original}"
        else:
            nombre_archivo = nombre_referencia

        carpeta_fecha = datetime.now().strftime("%d-%m-%Y")
        ruta_relativa = os.path.join(parent_folder, carpeta_fecha, nombre_archivo) #type:ignore
        ruta_absoluta = os.path.join(settings.MEDIA_ROOT, ruta_relativa)

        os.makedirs(os.path.dirname(ruta_absoluta), exist_ok=True)

        with open(ruta_absoluta, 'wb+') as destino:
            for chunk in archivo_recibido.chunks():
                destino.write(chunk)
        
        return nombre_archivo, ruta_relativa
    
    @transaction.atomic
    def perform_create(self, serializer):
        if not self.media_model:
            raise NotImplementedError("Se debe definir 'media_model'.")
        if not self.media_folder:
            raise NotImplementedError("Se debe definir 'media_folder'.")

        archivo_recibido = serializer.validated_data.pop('media', None)
        nombre_ingresado = serializer.validated_data.pop('media_nombre', None)

        usuario_actual = self.request.user if hasattr(self, 'request') and self.request.user.is_authenticated else None #type:ignore
        if hasattr(self, 'queryset') and hasattr(self.queryset.model, 'usuario') and usuario_actual: #type:ignore
            instance = serializer.save(usuario=usuario_actual)
        else:
            instance = serializer.save()

        read_data = self._get_read_serialized_data(instance) if hasattr(self, '_get_read_serialized_data') else None #type:ignore
        datos_respuesta = dict(read_data if read_data is not None else serializer.data)
        datos_respuesta['media'] = []

        if archivo_recibido:
            nombre_final, ruta_completa = self.guardar_archivo(
                archivo_recibido, 
                nombre_ingresado,
                carpeta_padre=self.media_folder
            )
            media_instance = self.media_model.objects.create(nombre=nombre_final, ruta=ruta_completa)
            instance.media.add(media_instance)

            ruta_url = f"{settings.MEDIA_URL}{media_instance.ruta}"
            full_url = self.request.build_absolute_uri(ruta_url) if hasattr(self, 'request') else ruta_url #type:ignore

            datos_respuesta['media'].append({
                "id": media_instance.id,
                "nombre": media_instance.nombre,
                "ruta": full_url
            })

        return datos_respuesta
    @transaction.atomic
    def perform_update(self, serializer):
        if not self.media_model:
            raise NotImplementedError("Se debe definir 'media_model'.")
        if not self.media_folder:
            raise NotImplementedError("Se debe definir 'media_folder'.")

        archivo_recibido = serializer.validated_data.pop('media', None)
        nombre_ingresado = serializer.validated_data.pop('media_nombre', None)

        instance = serializer.save()

        read_data = self._get_read_serialized_data(instance) if hasattr(self, '_get_read_serialized_data') else None #type:ignore
        datos_respuesta = dict(read_data if read_data is not None else serializer.data)
        datos_respuesta['media'] = []

        if archivo_recibido:
            for archivo_viejo in instance.media.all():
                ruta_fisica = os.path.join(settings.MEDIA_ROOT, archivo_viejo.ruta)
                if os.path.exists(ruta_fisica):
                    # os.remove(ruta_fisica) 
                    pass
                archivo_viejo.delete() 

            nombre_final, ruta_completa = self.guardar_archivo(
                archivo_recibido, 
                nombre_ingresado,
                carpeta_padre=self.media_folder
            )
            
            media_instance = self.media_model.objects.create(nombre=nombre_final, ruta=ruta_completa)
            instance.media.add(media_instance)

            ruta_url = f"{settings.MEDIA_URL}{media_instance.ruta}"
            full_url = self.request.build_absolute_uri(ruta_url) if hasattr(self, 'request') else ruta_url #type:ignore

            datos_respuesta['media'].append({
                "id": media_instance.id,
                "nombre": media_instance.nombre,
                "ruta": full_url
            })
        else:
            for media_existente in instance.media.all():
                ruta_url = f"{settings.MEDIA_URL}{media_existente.ruta}"
                full_url = self.request.build_absolute_uri(ruta_url) if hasattr(self, 'request') else ruta_url #type:ignore
                
                datos_respuesta['media'].append({
                    "id": media_existente.id,
                    "nombre": media_existente.nombre,
                    "ruta": full_url
                })

        return datos_respuesta
    
    def get_queryset(self):
        queryset = super().get_queryset() #type: ignore
        return queryset.prefetch_related('media')
    
    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            if 'media' in exc.detail:
                return bad_request_response(
                    exc.detail, 
                    "Tipo de documento no permitido", 
                    "El archivo enviado tiene un formato no permitido. Por favor, verifica la extensión e intenta de nuevo."
                )
        return super().handle_exception(exc) #type: ignore

class MixinViewset(viewsets.ModelViewSet):
    soft_delete_field = "activo"

    # ---------- CREATE ----------
    def create(self, request, *args, **kwargs):
        es_masivo = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=es_masivo)
        serializer.is_valid(raise_exception=True)
        usuario_actual = request.user if request.user.is_authenticated else None

        if es_masivo:
            nuevas_instancias = []
            
            for item_data in serializer.validated_data:
                instancia = self.queryset.model(**item_data) #type:ignore
                
                if hasattr(instancia, 'usuario') and usuario_actual:
                    instancia.usuario = usuario_actual
                    
                nuevas_instancias.append(instancia)
                
            instancias_creadas = self.queryset.model.objects.bulk_create(nuevas_instancias) #type:ignore
            serial_alterno = self._get_read_serialized_data(instancias_creadas, many=True)
            if serial_alterno is not None:
                return created_response(serial_alterno)
            return created_response(serializer.data)

        serial_alterno = self.perform_create(serializer)

        if serial_alterno: 
            return created_response(serial_alterno)
            
        return created_response(serializer.data)    
       
    def _get_read_serialized_data(self, instance, many=False):
        original_action = self.action
        self.action = 'retrieve'
        try:
            serializer_class = self.get_serializer_class()
        except Exception:
            serializer_class = self.get_serializer_class() # Fallback to default
        finally:
            self.action = original_action
            
        if serializer_class:
            return serializer_class(instance, many=many, context=self.get_serializer_context()).data
        return None

    def perform_create(self, serializer):
        usuario_actual = self.request.user if self.request.user.is_authenticated else None
        if hasattr(self.queryset.model, 'usuario') and usuario_actual: #type:ignore
            instance = serializer.save(usuario=usuario_actual)
        else:
            instance = serializer.save()
        return self._get_read_serialized_data(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        return self._get_read_serialized_data(instance)

    # ---------- LIST ----------
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data) 
        # return ok_response(serializer.data, "Consulta realizada correctamente")
    
    # ---------- PAGINATED RESPONSE ----------
    
    def get_paginated_response(self, data):
        return ok_response(
            data=data, 
            message="Consulta paginada realizada correctamente",
            count=self.paginator.page.paginator.count,        # type: ignore
            next=self.paginator.get_next_link(),              # type: ignore
            previous=self.paginator.get_previous_link()       # type: ignore
        )

    # ---------- RETRIEVE ----------
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return ok_response(serializer.data,"Consulta realizada correctamente")
    
    # ---------- UPDATE ----------
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serial_alterno = self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        if serial_alterno: return ok_response(serial_alterno, "Registro actualizado correctamente")
        return ok_response(serializer.data, "Registro actualizado correctamente")

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    # ---------- DELETE (SOFT) ----------

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not hasattr(instance, self.soft_delete_field):
            return not_found_response("Accion no permitida")
        setattr(instance, self.soft_delete_field, False)
        instance.save()
        return no_content_response("Registro desactivado correctamente")
    
    # ---------- ACTIVATE  ----------
    # @action(detail=True, methods=['patch'])
    # def activate(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     if not hasattr(instance, self.soft_delete_field) or getattr(instance, self.soft_delete_field) == True or not request.user.is_superuser:
    #         return no_content_response("Solicitud negada")
    #     setattr(instance, self.soft_delete_field, True)
    #     instance.save()
    #     return no_content_response("Registro activado correctamente")
    
    #---------- GET QUERYSET ----------
    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        if queryset is None:
            raise ImproperlyConfigured("No se ha especificado un queryset")
        if not user.is_superuser and hasattr(queryset.model, self.soft_delete_field):
            queryset = queryset.filter(**{self.soft_delete_field: True}) 
        return queryset#.order_by('id')

    # ---------- ERROR HANDLER ----------
    def handle_exception(self, exc):

        if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
            detalle = "Tu sesión ha expirado o el token es inválido."

            if (isinstance(exc.detail, str)): detalle = exc.detail
            
            return bad_request_response(
                data=None,
                error="Error de sesión",
                message=detalle,
                code=status.HTTP_401_UNAUTHORIZED
            )

        if isinstance(exc, ValidationError):
                    detalle = exc.detail

                    if isinstance(detalle, dict):
                        errores = dict(detalle)
                        mensaje_error = "Los datos enviados son incorrectos o están incompletos."
                        
                        if 'message' in errores:
                            msg_val = errores.pop('message')
                            mensaje_error = msg_val[0] if isinstance(msg_val, list) else msg_val
                        elif 'non_field_errors' in errores:
                            mensaje_error = " ".join([str(e) for e in errores.pop('non_field_errors')])

                        data_campos = errores if errores else None

                        return bad_request_response(
                            data=data_campos, 
                            error="Error de validación", 
                            message=str(mensaje_error)
                        )

                    if isinstance(detalle, list):
                        mensajes = []
                        for item in detalle:
                            if isinstance(item, str):
                                mensajes.append(item)
                            elif isinstance(item, dict) and 'non_field_errors' in item:
                                mensajes.extend([str(e) for e in item['non_field_errors']])
                        
                        mensaje_final = " ".join(mensajes) if mensajes else "Error de validación"
                        
                        return bad_request_response(
                            data=None, 
                            error="Error de validación", 
                            message=mensaje_final
                        )

                    return bad_request_response(
                        data=exc.detail, 
                        error="Error de validación", 
                        message="Los datos enviados son incorrectos o están incompletos."
                    )

        if hasattr(exc, "detail"):
            return bad_request_response(
                exc.detail, 
                "Error en la solicitud", 
                "Ocurrió un error al procesar los datos."
                )

        # Prueba Error crititco:
        if isinstance(exc, IntegrityError):
            return internal_error_response(
                {},
                "Error interno",
                "Ha ocurrido un error inesperado, favor de contactar con soporte tecnico"
                )

        if isinstance(exc, Http404):
            return not_found_response()

        if isinstance(exc, PermissionDenied):
            return forbidden_response(None)

        return super().handle_exception(exc)

class TemplateViewset(
                        GestorAutenticacion, 
                        GestorOrdenamiento,
                        MixinViewset 
                    ):
    """
    ViewSet base con:
    - Responses unificadas
    - Manipulacion del response desde perform_create()
    - Manejo de errores estándar
    - Remplazo de "Delete" por "Activo = False"
    - Filtrado de activos (excepto superuser)
    - Paginacion personalizada
    """