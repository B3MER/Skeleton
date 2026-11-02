from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from response import bad_request_response, ok_response, logout_response

class LoginView(ObtainAuthToken):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            groups = list(user.groups.values_list('name', flat=True))
            data = {
                'token': token.key,
                'username': user.username,
                'groups': groups,
                'nombre': user.first_name,
                'apellido': user.last_name,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            }
            return ok_response(data, 'Login exitoso')        
        return bad_request_response(serializer.errors, 'Error al iniciar sesión', 'Error al iniciar sesión: Las credenciales proporcionadas son incorrectas o la cuenta no tiene los permisos necesarios para acceder')

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        request.user.auth_token.delete()
        return logout_response()