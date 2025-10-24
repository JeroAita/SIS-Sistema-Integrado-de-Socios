from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import Group

from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff
from .serializers import (
    UsuarioSerializer,
    ActividadSerializer,
    InscripcionSerializer,
    CuotaSerializer,
    CompensacionStaffSerializer,
    UsuarioRegistroSerializer,
    UsuarioChangePasswordSerializer
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


"""
ViewSet para operaciones CRUD de Usuario

Endpoints automáticos:
- GET    /usuarios/           Listar todos los usuarios
- POST   /usuarios/           Crear nuevo usuario
- GET    /usuarios/{id}/      Obtener detalle de un usuario
- PUT    /usuarios/{id}/      Actualizar usuario completo
- PATCH  /usuarios/{id}/      Actualizar usuario parcial
- DELETE /usuarios/{id}/      Eliminar usuario

Endpoints con query-parameters:
- GET    /usuarios/?estado=[activo|inactivo|baja]   Listar usuarios con un estado
- GET    /usuarios/?grupo=[admin|staff|socio]       Listar usuarios de un grupo
    |
    +--> /usuarios/?estado=activo&grupo=socio       -> Devolvería una lista de usuarios socios y activos.

Endpoints @action:
- POST   /usuarios/{id}/cambiar_password/           Nota: requiere un body especificado en el método.
- POST   /usuarios/{id}/asignar_grupo/              Nota: requiere un body especificado en el método.
"""
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny] #[IsAuthenticated], [IsAdminUser] para que sólo lean/escriban usuarios o sólo lea/escriba usuario admin.

    def get_queryset(self):
        queryset = Usuario.objects.all()

        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        grupo = self.request.query_params.get('grupo', None)
        if grupo:
            queryset = queryset.filter(groups__name=grupo)
        
        # Acá pueden colocarse más filtros según queryparameters, como para
        #buscar por DNI o nombre.

        return queryset

    @action(detail=True, methods=['post']) # Decorador para definir endpoint personalizado
    def cambiar_password(self, request, pk=None):
        """
        - POST   /usuarios/{id}/cambiar_password/
        Body: {
            "password_actual": "...",
            "password_nueva": "...",
            "password_confirmacion": "...",
        }
        """
        usuario = self.get_object()
        serializer = UsuarioChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'mensaje': 'Contraseña actualizada exitosamente'},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def asignar_grupo(self, request, pk=None):
        """
        - POST   /usuarios/{id}/asignar_grupo/
        Body: {
            "grupo": ["admin" | "staff" | "socio"]
        }
        """
        usuario = self.get_object()
        grupo_req = request.data.get('grupo')

        if grupo_req not in ['admin', 'staff', 'socio']:
            return Response(
                {'error': 'Grupo inválido. Opciones: admin, staff, socio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            grupo = Group.objects.get(name=grupo_req)
            usuario.groups.add(grupo)
            return Response(
                {'mensaje': f'Grupo {grupo_req} asignado correctamente'},
                status=status.HTTP_200_OK
            )
        except Group.DoesNotExist:
            return Response(
                {'error': f'El grupo {grupo_req} no existe en el sistema'},
                status=status.HTTP_404_NOT_FOUND
            )

"""
ViewSet para operaciones CRUD de Actividad

Endpoints automáticos:
- GET    /actividades/           Listar todas las actividades
- POST   /actividades/           Crear nueva actividad
- GET    /actividades/{id}/      Obtener detalle de una actividad
- PUT    /actividades/{id}/      Actualizar actividad completa
- PATCH  /actividades/{id}/      Actualizar actividad parcial
- DELETE /actividades/{id}/      Eliminar actividad

Endpoints con query-parameters:
- GET    /actividades/?estado=[activa|finalizada|archivada]   Listar actividades con un estado
- GET    /actividades/?usuario_staff={id}                     Listar actividades de un mismo staff

Endpoints @action:
- POST   /actividades/{id}/finalizar/                         Finalizar actividad
- POST   /actividades/{id}/archivar/                          Archivar actividad
- GET    /actividades/{id}/inscriptos/                        Listar usuarios inscriptos a una actividad
"""
class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Actividad.objects.all()

        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        usuario_staff = self.request.query_params.get('usuario_staff', None)
        if usuario_staff:
            queryset = queryset.filter(usuario_staff_id=usuario_staff)

        return queryset
    
    @action(detail=True, methods=['post'])
    def finalizar(self, request, pk=None):
        actividad = self.get_object()
        
        if actividad.estado == 'finalizada':
            return Response (
                {'error': 'La actividad ya está finalizada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        actividad.estado = 'finalizada'
        actividad.save()

        serializer = self.get_serializer(actividad)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def archivar(self, request, pk=None):
        actividad = self.get_object()
        actividad.estado = 'archivada'
        actividad.save()

        serializer = self.get_serializer(actividad)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def inscriptos(self, request, pk=None):
        actividad = self.get_object()
        inscripciones = actividad.inscripciones.filter(estado='confirmada')
        serializer = InscripcionSerializer(inscripciones, many=True)
        return Response(serializer.data)

"""
ViewSet para operaciones CRUD de Inscripcion

Endpoints automáticos:
- GET    /inscripciones/         Listar todas las inscripciones
- POST   /inscripciones/         Crear nueva inscripción
- GET    /inscripciones/{id}/    Obtener detalle de una inscripción
- PUT    /inscripciones/{id}/    Actualizar inscripción completa
- PATCH  /inscripciones/{id}/    Actualizar inscripción parcial
- DELETE /inscripciones/{id}/    Eliminar inscripción

Endpoints con query-parameters:
- GET    /inscripciones/?estado=[confirmada|cancelada]
- GET    /inscripciones/?usuario_staff={id}
- GET    /inscripciones/?usuario_socio={id}

Endpoints @action:
- POST   /inscripciones/{id}/cancelar/
"""
class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Inscripcion.objects.all()
        
        usuario_socio = self.request.query_params.get('usuario_socio', None)
        if usuario_socio:
            queryset = queryset.filter(usuario_socio_id=usuario_socio)
        
        actividad = self.request.query_params.get('actividad', None)
        if actividad:
            queryset = queryset.filter(actividad_id=actividad)
        
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        inscripcion = self.get_object()
        
        if inscripcion.estado == 'cancelada':
            return Response(
                {'error': 'La inscripción ya está cancelada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        inscripcion.estado = 'cancelada'
        inscripcion.save()
        
        serializer = self.get_serializer(inscripcion)
        return Response(serializer.data)


"""
ViewSet para operaciones CRUD de Cuota

Endpoints automáticos:
- GET    /cuotas/         Listar todas las cuotas
- POST   /cuotas/         Crear nueva cuota
- GET    /cuotas/{id}/    Obtener detalle de una cuota
- PUT    /cuotas/{id}/    Actualizar cuota completa
- PATCH  /cuotas/{id}/    Actualizar cuota parcial
- DELETE /cuotas/{id}/    Eliminar cuota

Endpoints con query-parameters:
- GET    /cuotas/?estado=[al_dia|atrasada]
- GET    /cuotas/?usuario_socio={id}

Endpoints @action:
- POST   /cuotas/{id}/registrar_pago/       Nota: requiere un body especificado en el método.
- GET    /cuotas/atrasadas                  Lista todas las cuotas atrasadas
"""
class CuotaViewSet(viewsets.ModelViewSet):
    queryset = Cuota.objects.all()
    serializer_class = CuotaSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Cuota.objects.all()
        
        usuario_socio = self.request.query_params.get('usuario_socio', None)
        if usuario_socio:
            queryset = queryset.filter(usuario_socio_id=usuario_socio)
        
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def registrar_pago(self, request, pk=None):
        """
        - POST /cuotas/{id}/registrar_pago/
        
        Body: {
            "fecha_pago": "2025-10-24T15:30:00Z"  (opcional, usa fecha actual si no se provee)
        }
        """
        from django.utils import timezone
        
        cuota = self.get_object()
        
        if cuota.fecha_pago:
            return Response(
                {'error': 'Esta cuota ya fue pagada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Usar fecha provista o fecha actual
        fecha_pago = request.data.get('fecha_pago', timezone.now())
        cuota.fecha_pago = fecha_pago
        cuota.estado = 'al_dia'
        cuota.save()
        
        serializer = self.get_serializer(cuota)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def atrasadas(self, request):
        cuotas = Cuota.objects.filter(estado='atrasada')
        serializer = self.get_serializer(cuotas, many=True)
        return Response(serializer.data)

"""
ViewSet para operaciones CRUD de CompensacionStaff

Endpoints automáticos:
- GET    /compensaciones/         Listar todas las compensaciones
- POST   /compensaciones/         Crear nueva compensación
- GET    /compensaciones/{id}/    Obtener detalle de una compensación
- PUT    /compensaciones/{id}/    Actualizar compensación completa
- PATCH  /compensaciones/{id}/    Actualizar compensación parcial
- DELETE /compensaciones/{id}/    Eliminar compensación

Endpoints con query-parameters:
- GET    /compensaciones/?usuario_staff={id}
- GET    /compensaciones/?actividad={id}
- GET    /compensaciones/?periodo={YYYY-MM}

Endpoints @action:
- POST   /compensaciones/por_periodo/?periodo={YYYY-MM}   Agrupa compensaciones por periodo y calcula totales
"""
class CompensacionStaffViewSet(viewsets.ModelViewSet):
    queryset = CompensacionStaff.objects.all()
    serializer_class = CompensacionStaffSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = CompensacionStaff.objects.all()
        
        usuario_staff = self.request.query_params.get('usuario_staff', None)
        if usuario_staff:
            queryset = queryset.filter(usuario_staff_id=usuario_staff)
        
        actividad = self.request.query_params.get('actividad', None)
        if actividad:
            queryset = queryset.filter(actividad_id=actividad)
        
        periodo = self.request.query_params.get('periodo', None)
        if periodo:
            queryset = queryset.filter(periodo=periodo)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def por_periodo(self, request):
        periodo = request.query_params.get('periodo', None)
        
        if not periodo:
            return Response(
                {'error': 'Debe especificar un periodo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        compensaciones = CompensacionStaff.objects.filter(periodo=periodo)
        
        total = sum(c.monto for c in compensaciones)
        
        serializer = self.get_serializer(compensaciones, many=True)
        
        return Response({
            'periodo': periodo,
            'total': total,
            'cantidad': compensaciones.count(),
            'compensaciones': serializer.data
        })