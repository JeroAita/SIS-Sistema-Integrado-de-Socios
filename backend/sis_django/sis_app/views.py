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
from django.middleware.csrf import get_token


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
        Crea usuario. Si viene {"grupo": "staff"|"admin"|"socio"} en el body,
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
    pagination_class = None  # Desactivar paginación para ver todas las cuotas

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

    @action(detail=True, methods=["post"])
    def subir_comprobante(self, request, pk=None):
        cuota = self.get_object()
        
        # Verificar que la cuota no esté ya pagada
        if cuota.estado == "al_dia":
            return Response({"error": "Esta cuota ya está pagada"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que haya un archivo
        if 'comprobante' not in request.FILES:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        archivo = request.FILES['comprobante']
        
        # Validar tipo de archivo
        extension = archivo.name.split('.')[-1].lower()
        tipos_validos = ['pdf', 'jpg', 'jpeg', 'png']
        if extension not in tipos_validos:
            return Response({
                "error": f"Tipo de archivo no válido. Solo se permiten: {', '.join(tipos_validos)}"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar tamaño (3MB = 3 * 1024 * 1024 bytes)
        max_size = 3 * 1024 * 1024
        if archivo.size > max_size:
            return Response({
                "error": "El archivo no debe superar los 3MB"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Guardar el comprobante y cambiar estado a pendiente de revisión
        cuota.comprobante = archivo
        cuota.estado = "pendiente_revision"
        cuota.save()
        
        return Response({
            "mensaje": "Comprobante subido exitosamente. Será revisado por la administración.",
            "cuota": self.get_serializer(cuota).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"])
    def aprobar_pago(self, request, pk=None):
        """Endpoint para que el admin apruebe un pago (con o sin comprobante)"""
        from django.utils import timezone
        cuota = self.get_object()
        
        if cuota.estado == "al_dia":
            return Response({"error": "Esta cuota ya está aprobada"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Aprobar el pago (puede ser con o sin comprobante)
        # Si el admin aprueba manualmente, no hay comprobante
        # Si el socio subió comprobante y el admin lo aprueba, sí hay comprobante
        cuota.fecha_pago = timezone.now()
        cuota.estado = "al_dia"
        cuota.save()
        
        return Response({
            "mensaje": "Pago aprobado exitosamente",
            "cuota": self.get_serializer(cuota).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"])
    def rechazar_pago(self, request, pk=None):
        """Endpoint para que el admin rechace un pago"""
        cuota = self.get_object()
        
        if not cuota.comprobante:
            return Response({"error": "No hay comprobante para rechazar"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Rechazar: eliminar comprobante y volver a atrasada
        cuota.comprobante.delete()
        cuota.comprobante = None
        cuota.estado = "atrasada"
        cuota.save()
        
        return Response({
            "mensaje": "Comprobante rechazado. El socio deberá subir uno nuevo.",
            "cuota": self.get_serializer(cuota).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"])
    def generar_cuotas(self, request):
        """
        Genera cuotas para todos los socios activos del mes especificado.
        Incluye las inscripciones activas de cada socio.
        
        Body:
        {
            "mes": 12,           # 1-12
            "anio": 2024,
            "valor_base": 5000,  # Valor de la cuota social
            "dia_vencimiento": 10  # Día del mes de vencimiento
        }
        """
        from django.utils import timezone
        from datetime import datetime
        from decimal import Decimal
        from django.db import transaction
        
        # Validar datos
        mes = request.data.get('mes')
        anio = request.data.get('anio')
        valor_base = request.data.get('valor_base')
        dia_vencimiento = request.data.get('dia_vencimiento', 10)
        
        if not all([mes, anio, valor_base]):
            return Response({
                "error": "Faltan parámetros requeridos: mes, anio, valor_base"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mes = int(mes)
            anio = int(anio)
            valor_base = Decimal(str(valor_base))
            dia_vencimiento = int(dia_vencimiento)
            
            if not (1 <= mes <= 12):
                raise ValueError("El mes debe estar entre 1 y 12")
            if not (1 <= dia_vencimiento <= 28):
                raise ValueError("El día debe estar entre 1 y 28")
        except (ValueError, TypeError) as e:
            return Response({"error": f"Parámetros inválidos: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fecha de vencimiento
        try:
            fecha_vencimiento = datetime(anio, mes, dia_vencimiento, 23, 59, 59)
            fecha_vencimiento = timezone.make_aware(fecha_vencimiento)
        except ValueError as e:
            return Response({"error": f"Fecha inválida: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener todos los socios activos
        # Nota: es_socio es una property, no un campo DB, así que filtramos por grupo
        socios = Usuario.objects.filter(
            groups__name='socio',
            estado='activo'
        ).distinct()
        
        # Usar transacción para asegurar atomicidad
        try:
            with transaction.atomic():
                cuotas_creadas = []
                
                for socio in socios:
                    # Verificar si ya existe una cuota para este período
                    cuota_existente = Cuota.objects.filter(
                        usuario_socio=socio,
                        periodo_mes=mes,
                        periodo_anio=anio
                    ).first()
                    
                    # Si ya existe, omitir
                    if cuota_existente:
                        continue
                    
                    # Crear la cuota
                    cuota = Cuota.objects.create(
                        usuario_socio=socio,
                        fecha_vencimiento=fecha_vencimiento,
                        valor_base=valor_base,
                        estado="atrasada",
                        periodo_mes=mes,
                        periodo_anio=anio
                    )
                    
                    # Obtener inscripciones activas del socio
                    inscripciones = Inscripcion.objects.filter(
                        usuario_socio=socio,
                        estado='confirmada'
                    )
                    
                    # Agregar inscripciones a la cuota
                    cuota.inscripciones.set(inscripciones)
                    cuota.save()
                    
                    cuotas_creadas.append({
                        "socio": f"{socio.first_name} {socio.last_name}",
                        "cuota_id": cuota.id,
                        "valor_base": float(cuota.valor_base),
                        "valor_actividades": float(cuota.valor_actividades),
                        "valor_total": float(cuota.valor_total),
                        "num_inscripciones": inscripciones.count()
                    })
                
                return Response({
                    "mensaje": f"Proceso completado",
                    "cuotas_creadas": len(cuotas_creadas),
                    "detalle": {
                        "creadas": cuotas_creadas
                    }
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                "error": f"Error al generar cuotas: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        # Asegurar que se envíe el token CSRF
        get_token(request)
        
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
        
        # Setear cookies de autenticación
        response.set_cookie(
            'access_token',
            str(access_token),
            max_age=3600,  # 1 hora
            httponly=True,
            secure=False,  # Cambiar a True en producción con HTTPS
            samesite='Lax',
            path='/'
        )
        
        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=604800,  # 7 días
            httponly=True,
            secure=False,  # Cambiar a True en producción con HTTPS
            samesite='Lax',
            path='/'
        )
        
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({'message': 'Logout exitoso'})
        
        # Limpiar cookies con las mismas opciones que se usaron para setearlas
        # Importante: usar max_age=0 para forzar la eliminación inmediata
        response.set_cookie(
            'access_token',
            '',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            path='/',
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        response.set_cookie(
            'refresh_token',
            '',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            path='/',
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        
        return response


class UserProfileView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Asegurar que se envíe el token CSRF
        get_token(request)
        
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
