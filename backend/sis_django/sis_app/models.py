# sis_app/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    class EstadoUsuario(models.TextChoices):
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

    @property
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

    nombre            = models.CharField(max_length=100)
    descripcion       = models.TextField()
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin    = models.DateTimeField()
    cargo_inscripcion = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pesos Argentinos")
    estado            = models.CharField(max_length=20, choices=EstadoActividad.choices, default=EstadoActividad.ACTIVA)
    usuario_staff     = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='actividades_dictadas'
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
    
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    usuario_socio = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="inscripciones")
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, related_name="inscripciones")
    estado = models.CharField(max_length=10, choices=EstadoInscripcion.choices, default=EstadoInscripcion.CONFIRMADA)

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
    usuario_staff = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name="compensaciones")
    actividad = models.ForeignKey(Actividad, on_delete=models.PROTECT, related_name="compensaciones")
    monto = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pesos Argentinos")

    def __str__(self):
        return f"Compensación a staff {self.usuario_staff} por actividad {self.actividad}"
