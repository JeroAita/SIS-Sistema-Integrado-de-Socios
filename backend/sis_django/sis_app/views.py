from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import Group
from django.db import transaction
from django.db import IntegrityError
from django.db.utils import IntegrityError as DBIntegrityError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import HttpResponse


from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff
from .serializers import (
    UsuarioSerializer,
    ActividadSerializer,
    InscripcionSerializer,
    CuotaSerializer,
    CompensacionStaffSerializer,
)

"""
En la asignatura vimos codificación de vistas creando clases que heredan
de APIView. Para estas clases, se define manualmente un método por cada
método HTTP y una ruta a la que asociarlo.

Una alternativa es heredar de viewsets.ModelViewSet, que define automáticamente
los métodos CRUD estándares para APIs REST y sus rutas. Pueden extenderse
sobreescribiendo métodos, pero acorta el código de no necesitar personalizarlos.

Como se están siguiendo los estándares de APIs REST, optamos por utilizar ViewSet.
"""

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by("id")
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    authentication_classes = []   # evitar CSRF en dev

    def get_queryset(self):
        qs = Usuario.objects.all().order_by("id")
        estado = self.request.query_params.get('estado')
        if estado:
            qs = qs.filter(estado=estado)
        grupo = self.request.query_params.get('grupo')
        if grupo:
            qs = qs.filter(groups__name=grupo)
        return qs.distinct()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Crea usuario. Si viene {"grupo": "staff|admin|socio"} en el body,
        asigna el grupo y sincroniza is_staff en la misma llamada.
        """
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        except (IntegrityError, DBIntegrityError) as e:
            return Response({"error": "Violación de unicidad (dni/username/email).", "detalle": str(e)}, status=400)

        grupo_req = (
            request.data.get("grupo")
            or request.data.get("group")
        )
        if grupo_req in ("admin", "staff", "socio"):
            g, _ = Group.objects.get_or_create(name=grupo_req)
            user.groups.add(g)
            if grupo_req in ("admin", "staff"):
                user.is_staff = True
            elif grupo_req == "socio" and not user.groups.filter(name="admin").exists():
                user.is_staff = False
            user.save(update_fields=["is_staff"])

        headers = self.get_success_headers(serializer.data)
        # devolvemos el usuario actualizado (por si ya se asignó grupo)
        return Response(UsuarioSerializer(user).data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def asignar_grupo(self, request, pk=None):
        usuario = self.get_object()
        grupo_req = (request.data.get('grupo') or request.data.get('group'))
        if grupo_req not in ('admin', 'staff', 'socio'):
            return Response({'error': 'Grupo inválido (admin/staff/socio).'}, status=400)
        g, _ = Group.objects.get_or_create(name=grupo_req)
        usuario.groups.add(g)
        if grupo_req in ('admin', 'staff'):
            usuario.is_staff = True
        elif grupo_req == 'socio' and not usuario.groups.filter(name='admin').exists():
            usuario.is_staff = False
        usuario.save(update_fields=['is_staff'])
        return Response(UsuarioSerializer(usuario).data, status=200)

    @action(detail=True, methods=['post'])
    def cambiar_password(self, request, pk=None):
        usuario = self.get_object()
        pwd = request.data.get("password_nueva")
        if not pwd:
            return Response({"error": "password_nueva requerida"}, status=400)
        usuario.set_password(pwd)
        usuario.save()
        return Response({"mensaje": "Contraseña actualizada"}, status=200)

    @action(detail=False, methods=['get'])
    def resumen_roles(self, request):
        return Response({
            "total": Usuario.objects.count(),
            "admin": Usuario.objects.filter(groups__name='admin').distinct().count(),
            "staff": Usuario.objects.filter(groups__name='staff').distinct().count(),
            "socios": Usuario.objects.filter(groups__name='socio').distinct().count(),
        })


# =====================================================
#        ACTIVIDADES
# =====================================================
class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all().order_by("id")
    serializer_class = ActividadSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Actividad.objects.all().order_by("id")

        estado = self.request.query_params.get("estado")
        if estado:
            queryset = queryset.filter(estado=estado)

        usuario_staff = self.request.query_params.get("usuario_staff")
        if usuario_staff:
            queryset = queryset.filter(usuario_staff_id=usuario_staff)

        return queryset.distinct()

    @action(detail=True, methods=["post"])
    def finalizar(self, request, pk=None):
        actividad = self.get_object()
        if actividad.estado == "finalizada":
            return Response({"error": "La actividad ya está finalizada"}, status=status.HTTP_400_BAD_REQUEST)
        actividad.estado = "finalizada"
        actividad.save()
        return Response(self.get_serializer(actividad).data)

    @action(detail=True, methods=["post"])
    def archivar(self, request, pk=None):
        actividad = self.get_object()
        actividad.estado = "archivada"
        actividad.save()
        return Response(self.get_serializer(actividad).data)

    @action(detail=True, methods=["get"])
    def inscriptos(self, request, pk=None):
        actividad = self.get_object()
        inscripciones = actividad.inscripciones.filter(estado="confirmada")
        serializer = InscripcionSerializer(inscripciones, many=True)
        return Response(serializer.data)


# =====================================================
#        INSCRIPCIONES
# =====================================================
class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all().order_by("id")
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Inscripcion.objects.all().order_by("id")

        usuario_socio = self.request.query_params.get("usuario_socio")
        if usuario_socio:
            queryset = queryset.filter(usuario_socio_id=usuario_socio)

        actividad = self.request.query_params.get("actividad")
        if actividad:
            queryset = queryset.filter(actividad_id=actividad)

        estado = self.request.query_params.get("estado")
        if estado:
            queryset = queryset.filter(estado=estado)

        return queryset.distinct()

    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        inscripcion = self.get_object()
        if inscripcion.estado == "cancelada":
            return Response({"error": "Ya está cancelada"}, status=status.HTTP_400_BAD_REQUEST)
        inscripcion.estado = "cancelada"
        inscripcion.save()
        return Response(self.get_serializer(inscripcion).data)


# =====================================================
#        CUOTAS
# =====================================================
class CuotaViewSet(viewsets.ModelViewSet):
    queryset = Cuota.objects.all().order_by("id")
    serializer_class = CuotaSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Cuota.objects.all().order_by("id")

        usuario_socio = self.request.query_params.get("usuario_socio")
        if usuario_socio:
            queryset = queryset.filter(usuario_socio_id=usuario_socio)

        estado = self.request.query_params.get("estado")
        if estado:
            queryset = queryset.filter(estado=estado)

        return queryset.distinct()

    @action(detail=True, methods=["post"])
    def registrar_pago(self, request, pk=None):
        from django.utils import timezone
        cuota = self.get_object()
        if cuota.fecha_pago:
            return Response({"error": "Esta cuota ya fue pagada"}, status=status.HTTP_400_BAD_REQUEST)
        cuota.fecha_pago = request.data.get("fecha_pago", timezone.now())
        cuota.estado = "al_dia"
        cuota.save()
        return Response(self.get_serializer(cuota).data)

    @action(detail=False, methods=["get"])
    def atrasadas(self, request):
        cuotas = Cuota.objects.filter(estado="atrasada")
        return Response(self.get_serializer(cuotas, many=True).data)


# =====================================================
#        COMPENSACIONES STAFF
# =====================================================
class CompensacionStaffViewSet(viewsets.ModelViewSet):
    queryset = CompensacionStaff.objects.all().order_by("id")
    serializer_class = CompensacionStaffSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = CompensacionStaff.objects.all().order_by("id")

        usuario_staff = self.request.query_params.get("usuario_staff")
        if usuario_staff:
            queryset = queryset.filter(usuario_staff_id=usuario_staff)

        actividad = self.request.query_params.get("actividad")
        if actividad:
            queryset = queryset.filter(actividad_id=actividad)

        periodo = self.request.query_params.get("periodo")
        if periodo:
            queryset = queryset.filter(periodo=periodo)

        return queryset.distinct()

    @action(detail=False, methods=["get"])
    def por_periodo(self, request):
        periodo = self.request.query_params.get("periodo")
        if not periodo:
            return Response({"error": "Debe especificar un periodo"}, status=status.HTTP_400_BAD_REQUEST)
        compensaciones = CompensacionStaff.objects.filter(periodo=periodo)
        total = sum(c.monto for c in compensaciones)
        serializer = self.get_serializer(compensaciones, many=True)
        return Response(
            {
                "periodo": periodo,
                "total": total,
                "cantidad": compensaciones.count(),
                "compensaciones": serializer.data,
            }
        )


# =====================================================
#        AUTENTICACIÓN
# =====================================================
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username y password requeridos'}, status=400)
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Credenciales inválidas'}, status=401)
        
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        response = Response({
            'user': UsuarioSerializer(user).data,
            'access': str(access_token),
            'refresh': str(refresh)
        })
        
        # Setear cookies
        response.set_cookie(
            'access_token',
            str(access_token),
            max_age=3600,  # 1 hora
            httponly=True,
            secure=False,  # Cambiar a True en producción con HTTPS
            samesite='Lax'
        )
        
        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=604800,  # 7 días
            httponly=True,
            secure=False,  # Cambiar a True en producción con HTTPS
            samesite='Lax'
        )
        
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({'message': 'Logout exitoso'})
        
        # Limpiar cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response


class UserProfileView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Verificar si hay token en las cookies
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return Response({'error': 'No autenticado'}, status=401)
        
        # Verificar el token manualmente
        from rest_framework_simplejwt.tokens import AccessToken
        try:
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = Usuario.objects.get(id=user_id)
            return Response(UsuarioSerializer(user).data)
        except:
            return Response({'error': 'Token inválido'}, status=401)
