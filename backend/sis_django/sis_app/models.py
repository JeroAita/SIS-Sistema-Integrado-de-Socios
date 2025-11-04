from django.db import models
from django.contrib.auth.models import AbstractUser

"""
# La clase AbstractUser provee automáticamente los campos:
username         # CharField(max_length=150, unique=True)
password         # CharField(max_length=128) -> hasheado automáticamente
email            # EmailField(blank=True)
first_name       # CharField(max_length=150, blank=True)
last_name        # CharField(max_length=150, blank=True)

# Más campos de permisos y auditoría (no los necesitamos):
is_staff         # BooleanField(default=False) -> acceso al admin
is_active        # BooleanField(default=True)  -> cuenta activa
is_superuser     # BooleanField(default=False) -> todos los permisos
date_joined      # DateTimeField(auto_now_add=True)
last_login       # DateTimeField(blank=True, null=True)

# y relaciones con clases que gestionan permisos (nos conviene utilizarlos):
groups           # ManyToManyField(Group)      -> grupos del usuario.
user_permissions # ManyToManyField(Permission) -> permisos específicos

# Crear una clase Usuario manualmente requeriría una gestión manual de permisos - que 
#originalmente pensábamos resolver con una clase "Perfil" y otra "Ruta".
# La siguiente clase debe estar registrada en settings.py del proyecto como AUTH_USER_MODEL.
"""
class Usuario(AbstractUser):
    class EstadoUsuario(models.TextChoices): # Clase auxiliar para el campo 'estado'
        ACTIVO   = 'activo', 'Activo'
        INACTIVO = 'inactivo', 'Inactivo'
        BAJA     = 'baja', 'Baja'
    
    dni      = models.CharField(max_length=10, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    estado   = models.CharField(
        max_length=10,
        choices=EstadoUsuario.choices,
        default=EstadoUsuario.ACTIVO
    )

    @property # Decorador: el método se accede como campo, por más que sea un método.
    def es_admin(self):
        return self.groups.filter(name='admin').exists()
    
    @property
    def es_staff(self):
        return self.groups.filter(name='staff').exists()
    
    @property
    def es_socio(self):
        return self.groups.filter(name='socio').exists()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Actividad(models.Model):
    class EstadoActividad(models.TextChoices):
        ACTIVA     = 'activa', 'Activa'
        FINALIZADA = 'finalizada', 'Finalizada'
        ARCHIVADA  = 'archivada', 'Archivada'

    #id               = models.Autofield(primary_key=True) Django crea este campo automáticamente.
    nombre            = models.CharField(max_length=100)
    descripcion       = models.TextField()
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin    = models.DateTimeField()
    cargo_inscripcion = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pesos Argentinos")
    estado            = models.CharField(max_length=20, choices=EstadoActividad.choices, default=EstadoActividad.ACTIVA)
    usuario_staff     = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='actividades_dictadas' # Permite ver las actividades de un usuario staff con: usuario.actividades_dictadas.all()
    )

    @property
    def cantidad_inscriptos(self):
        return self.inscripciones.filter(estado='confirmada').count()

    def __str__(self):
        return f"{self.nombre} - {self.usuario_staff.first_name}"

class Inscripcion(models.Model):
    class EstadoInscripcion(models.TextChoices):
        CONFIRMADA = 'confirmada', 'Confirmada'
        CANCELADA  = 'cancelada', 'Cancelada'
    class EstadoPago(models.TextChoices):
        ABONADA = 'abonada', 'Abonada'
        PENDIENTE = 'pendiente', 'Pendiente'

    fecha_inscripcion = models.DateTimeField(auto_now_add=True) # Carga autom. la fecha/hora cuando se crea la instancia.
    usuario_socio = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="inscripciones")
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, related_name="inscripciones")
    estado = models.CharField(max_length=10, choices=EstadoInscripcion.choices, default=EstadoInscripcion.CONFIRMADA)
    estado_pago = models.CharField(max_length=10, choices=EstadoPago.choices, default=EstadoPago.PENDIENTE)

    def __str__(self):
        return f"Inscripción de usuario {self.usuario_socio} a actividad {self.actividad}"

class Cuota(models.Model):
    class EstadoCuota(models.TextChoices):
        AL_DIA = "al_dia", "Al_dia"
        ATRASADA = "atrasada", "Atrasada"
    
    fecha_vencimiento = models.DateTimeField()
    fecha_pago        = models.DateTimeField(null=True, blank=True)
    valor_base        = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pesos Argentinos")
    usuario_socio     = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name="cuotas")
    estado            = models.CharField(max_length=10, choices=EstadoCuota.choices, default=EstadoCuota.ATRASADA)

    @property
    def dias_atraso(self):
        from django.utils import timezone
        if self.fecha_pago:
            return 0
        if self.fecha_vencimiento < timezone.now():
            delta = timezone.now() - self.fecha_vencimiento
            return delta.days
        return 0

    def __str__(self):
        return f"Cuota de usuario {self.usuario_socio}"

class CompensacionStaff(models.Model):
    periodo = models.CharField(max_length=100)
    usuario_staff = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name="compensaciones") # PROTECT acá impide eliminar usuarios que adeuden cuotas.
    actividad = models.ForeignKey(Actividad, on_delete=models.PROTECT, related_name="compensaciones")
    monto = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pesos Argentinos")

    def __str__(self):
        return f"Compensación a staff {self.usuario_staff} por actividad {self.actividad}"
