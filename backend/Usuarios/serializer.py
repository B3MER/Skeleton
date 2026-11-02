from django.contrib.auth.models import User, Group, Permission
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

class PermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'content_type', 'name', 'codename']

class GrupoSerializer(serializers.ModelSerializer):
    permissions_id = PermisosSerializer(many = True, read_only=True, source='permissions')
    permissions = PrimaryKeyRelatedField(many=True, write_only=True, queryset=Permission.objects.all(), )
    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions','permissions_id']

#--------------USUARIOS------------------

class UsuarioSerializerCU(serializers.ModelSerializer):
    groups= serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True )
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email','is_active', 'is_staff', 'is_superuser', 'groups']
        extra_kwargs = {'password': {'write_only': True}}

class UsuarioSerializerLR(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email','is_active', 'is_staff', 'is_superuser', 'groups']
        extra_kwargs = {'password': {'write_only': True}}