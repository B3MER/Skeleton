import re
import os
from rest_framework import serializers


def rango_letras(value, max=500, min=0, alert=""):
    """Valida la longitud de la cadena."""
    if not (min <= len(str(value)) <= max):
        if alert:
            raise serializers.ValidationError(alert)    
        raise serializers.ValidationError(
            f'Este campo debe tener entre {min} y {max} caracteres.'
        )

def solo_placa(value):
    if not re.match(r'^[A-Z0-9]{6,9}$', value):
        raise serializers.ValidationError('La placa debe tener entre 6 y 7 caracteres alfanumericos (En mayúsculas y sin espacios o guiones)')
    if not value.isupper() and not re.match(r'^[A-Z0-9]{6,9}$', value):
        raise serializers.ValidationError('La placa debe estar en mayúsculas')
    return value

def letras_y_numeros(value, max=500, min=0, alert=""):
    if value is None or value == "":
        return value
    if not re.match(r'^[a-zA-Z0-9ÁÉÍÓÚáéíóúñÑüÜ\s.,-]+$', value):
        raise serializers.ValidationError('Este campo solo acepta letras y números (En mayúsculas)')
    rango_letras(value, max, min, alert)
    return value

def letras_y_numeros_sin_espacios(value, max=500, min=0, alert=""):
    if value is None or value == "":
        return value
    if not re.match(r'^[a-zA-Z0-9ÁÉÍÓÚáéíóúñÑüÜ.,]+$', value):
        raise serializers.ValidationError('Este campo solo acepta letras y números sin espacios (En mayúsculas)')
    rango_letras(value, max, min, alert)
    return value

def solo_letras_sin_espacios(value, max=500, min=0, alert=""):
    if value is None or value == "":
        return value
    if not value.isalpha():
        raise serializers.ValidationError('Este campo solo acepta letras sin espacios')
    rango_letras(value, max, min, alert)
    return value

def solo_letras(value, max=500, min=0, alert=""):
    if value is None or value == "":
        return value
    if not re.match(r'^[a-zA-ZÁÉÍÓÚáéíóúñÑüÜ\s.,]+$', value):        
        raise serializers.ValidationError('Este campo solo acepta letras')
    if value.isspace():
        raise serializers.ValidationError('Este campo no puede estar vacío')
    rango_letras(value, max, min, alert)
    return value

def solo_numeros(value, max=18, min=1, alert = ""):
    if isinstance(value, int):
        if not ( (10**(min-1)) <= value <= (10**max - 1)):
            if alert:
                raise serializers.ValidationError(alert)
            raise serializers.ValidationError(f'Este campo solo acepta de {min} hasta {max} dígitos')
    else:
        if not value.isdigit():
            raise serializers.ValidationError('Este campo solo acepta números')
        rango_letras(value, max, min)
        
    return value

def solo_flotantes(value, max=100.0, min=0.00, alert=""):
    try:
        valor_num = float(value)
    except (ValueError, TypeError):
        raise serializers.ValidationError("Este campo debe ser un número válido o decimal.")

    if not (min <= valor_num <= max):
        if alert:
            raise serializers.ValidationError(alert)
        raise serializers.ValidationError(
            f'El valor debe estar entre {min} y {max}.'
        )
    return value

def solo_media(value, ext_media = None):
    if value is None or value == "":
        return value
    nombre_original, ext_original = os.path.splitext(value.name)
    if ext_media is not None:
            if isinstance(ext_media, str):
                formatos_permitidos = [ext_media]
            else:
                formatos_permitidos = ext_media

            ext_limpia = ext_original.lstrip('.').lower()

            if (ext_original.lower() not in formatos_permitidos) and (ext_limpia not in formatos_permitidos):
                raise serializers.ValidationError(f"Extensión {ext_original} no permitida.")
    return value

def valor_minimo(value, min=0, alert="", **kwargs):
    if value is None or value == "":
        return value
    min_val = kwargs.get('minimo', min)
    try:
        valor_num = float(value)
    except (ValueError, TypeError):
        raise serializers.ValidationError("Este campo debe ser un número válido.")
    if valor_num < min_val:
        if alert:
            raise serializers.ValidationError(alert)
        disp = int(min_val) if int(min_val) == min_val else min_val
        raise serializers.ValidationError(f"El valor no puede ser menor a {disp}.")
    return value

def valor_maximo(value, max=100, alert="", **kwargs):
    if value is None or value == "":
        return value
    max_val = kwargs.get('maximo', max)
    try:
        valor_num = float(value)
    except (ValueError, TypeError):
        raise serializers.ValidationError("Este campo debe ser un número válido.")
    if valor_num > max_val:
        if alert:
            raise serializers.ValidationError(alert)
        disp = int(max_val) if int(max_val) == max_val else max_val
        raise serializers.ValidationError(f"El valor no puede ser mayor a {disp}.")
    return value

valor_min = valor_minimo
min_valor = valor_minimo
solo_min = valor_minimo
valor_max = valor_maximo
max_valor = valor_maximo
solo_max = valor_maximo

def longitud_minima(value, min=0, alert="", **kwargs):
    if value is None:
        return value
    min_val = kwargs.get('minimo', min)
    if len(str(value)) < min_val:
        if alert:
            raise serializers.ValidationError(alert)
        raise serializers.ValidationError(f"Este campo debe tener al menos {min_val} caracteres.")
    return value

def longitud_maxima(value, max=500, alert="", **kwargs):
    if value is None:
        return value
    max_val = kwargs.get('maximo', max)
    if len(str(value)) > max_val:
        if alert:
            raise serializers.ValidationError(alert)
        raise serializers.ValidationError(f"Este campo no puede tener más de {max_val} caracteres.")
    return value

min_longitud = longitud_minima
max_longitud = longitud_maxima

