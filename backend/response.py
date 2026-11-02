from rest_framework.response import Response
from rest_framework import status

# Estos response se encargan de cambiar la respuesta de 
# cada uno de los metodos CRUD estos son extraidos por 
# el serializers de core, quien es quien aplica dichos cambios
# a cada uno de los viewsets

def created_response(
    data,
    message="Registro guardado correctamente",
    error="Éxito",
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": 201,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_201_CREATED)

def ok_response(
    data,
    message="Acción realizada correctamente",
    error="Éxito",
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": 200,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_200_OK)

def no_content_response(
    message="Acción realizada correctamente",
    **kwargs
):
    response_dict = {
        "message": message,
        "code": 204
    }
    response_dict.update(kwargs)
    return Response(response_dict, status.HTTP_204_NO_CONTENT)

def internal_error_response(
    data=None,
    error="Error interno",
    message="Ha ocurrido un error inesperado al procesar la petición",
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": 500,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_500_INTERNAL_SERVER_ERROR)

def not_found_response(
    data=None,
    error="No encontrado",
    message="Ha ocurrido un error, el objeto no existe",
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": 404,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_404_NOT_FOUND)

def forbidden_response(
    data,
    error="Permiso denegado",
    message="Usted no tiene permiso para realizar esta acción",
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": 403,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_403_FORBIDDEN)

def bad_request_response(
    data,
    error="Peticion mala",
    message="Ha ocurrido un error, valida los campos",
    code=400,
    **kwargs
):
    response_dict = {
        "error": error,
        "message": message,
        "code": code,
    }
    response_dict.update(kwargs)
    response_dict["data"] = data  
    return Response(response_dict, status.HTTP_400_BAD_REQUEST)

def logout_response(
    message="Sesion cerrada correctamente, redirigiendo a la pantalla de login",
    **kwargs
):
    response_dict = {
        "message": message,
        "code": 302
    }
    response_dict.update(kwargs)
    return Response(response_dict, status.HTTP_302_FOUND)