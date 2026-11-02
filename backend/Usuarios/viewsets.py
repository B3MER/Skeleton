from Helpers.mixinsDJRF  import TemplateViewset
from .serializer import PermisosSerializer, UsuarioSerializerLR, UsuarioSerializerCU, GrupoSerializer
from django.contrib.auth.models import Permission, Group, User
from response import ok_response, bad_request_response
from django.db import transaction

class PermisosViewSet(TemplateViewset):
    queryset = Permission.objects.all()
    serializer_class = PermisosSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('id')

class GrupoViewSet(TemplateViewset):
    queryset = Group.objects.prefetch_related('permissions').all()
    serializer_class = GrupoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
             return bad_request_response(serializer.errors, 'Error al crear el grupo')
        content_types = request.data.get('content_type', [])
        try:
            with transaction.atomic():
                validated_data = serializer.validated_data
                permisos_ids = validated_data.pop('permissions', [])
                if content_types:
                    permisos_extra = Permission.objects.filter(content_type_id__in=content_types)
                    todos_permisos = list(set(list(permisos_ids) + list(permisos_extra)))
                else:
                    todos_permisos = permisos_ids
                grupo = serializer.save()
                grupo.permissions.set(todos_permisos)
                data = {
                    'id': grupo.id,
                    'grupo': grupo.name,
                    'permissions': PermisosSerializer(todos_permisos, many=True).data
                }
                return ok_response(data, 'Grupo creado con éxito')
        except Exception as e:
            return bad_request_response(str(e), 'Error procesando la solicitud')

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Exception:
            return bad_request_response('El grupo no existe', 'Error al actualizar')
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return bad_request_response(serializer.errors, 'Error al actualizar el grupo')
        content_types = request.data.get('content_type', [])
        try:
            with transaction.atomic():
                validated_data = serializer.validated_data
                permisos_ids = validated_data.pop('permissions', [])
                if content_types:
                    permisos_extra = Permission.objects.filter(content_type_id__in=content_types)
                    todos_permisos = list(set(list(permisos_ids) + list(permisos_extra)))
                else:
                    todos_permisos = permisos_ids
                grupo = serializer.save()
                grupo.permissions.set(todos_permisos)
                data = {
                    'id': grupo.id,
                    'grupo': grupo.name,
                    'permissions': PermisosSerializer(grupo.permissions.all(), many=True).data
                }
                return ok_response(data, 'Grupo actualizado con éxito')

        except Exception as e:
             return bad_request_response(str(e), 'Error procesando la solicitud')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('id')

class RegistroViewSet(TemplateViewset):
    queryset = User.objects.prefetch_related('groups__permissions').all()
    serializer_class = UsuarioSerializerLR
    soft_delete_field = 'is_active' 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return bad_request_response(serializer.errors, 'Error al crear el usuario')

        try:
            with transaction.atomic():
                validated_data = serializer.validated_data
                groups = validated_data.pop('groups', [])
                password = validated_data.pop('password')
                
                user = User.objects.create_user(password=password, **validated_data)
                user.groups.set(groups)
                
                data = self.response(user, user.groups.all())
                return ok_response(data, 'Usuario creado con éxito')
        except Exception as e:
            return bad_request_response(str(e), 'Error procesando la solicitud')

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Exception:
            return bad_request_response('El usuario no existe', 'Error al actualizar')
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
             return bad_request_response(serializer.errors, 'Error al actualizar el usuario')

        try:
            with transaction.atomic():
                validated_data = serializer.validated_data
                password = validated_data.pop('password', None)

                if password:
                    instance.set_password(password)
                    instance.save()
                
                if 'groups' in validated_data:
                    groups = validated_data.pop('groups')
                    instance.groups.set(groups)
                
                serializer.save()
                data = self.response(instance, instance.groups.all())
                return ok_response(data, 'Usuario actualizado con éxito')
        except Exception as e:
            return bad_request_response(str(e), 'Error procesando la solicitud')

    def response(self, user, groups):
        permissions = list(Permission.objects.filter(group__user=user).distinct().values_list('name', flat=True))
        data= {
            'username': user.username,
            'groups': list(groups.values_list('name', flat=True)),
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
            'permissions': permissions
        }
        
        return ok_response(data, 'MensajePrueba')

    def get_serializer_class(self):
        serial = {
            'list': UsuarioSerializerLR,
            'retrieve': UsuarioSerializerLR,
            'create': UsuarioSerializerCU,
            'update': UsuarioSerializerCU,
            'partial_update': UsuarioSerializerCU,
        }
        return serial[self.action] if self.action in serial else self.serializer_class
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # if self.request.user.is_superuser:
        #     return queryset
        return queryset.filter(id=self.request.user.id).order_by('id')
    