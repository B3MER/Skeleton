from datetime import timedelta
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class TokenDelete(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        tiempo_expiracion = timedelta(hours=24)#hours=2) 
        # print(token.created - (timezone.now() - tiempo_expiracion))
        if token.created < timezone.now() - tiempo_expiracion:
            token.delete()
            raise AuthenticationFailed('El token ha expirado. Por favor, inicie sesión nuevamente.')
        return user, token