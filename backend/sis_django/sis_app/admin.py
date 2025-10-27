from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff #, Pago

# Registrar Usuario con UserAdmin personalizado
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Campos que se muestran en la lista
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'estado')
    list_filter = ('is_staff', 'is_superuser', 'estado', 'groups')
    
    # Campos para crear/editar usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email', 'dni', 'telefono')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Estado', {'fields': ('estado',)}),
    )
    
    # Campos para crear nuevo usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'first_name', 'last_name', 'email', 'dni'),
        }),
    )

# Registrar otros modelos
admin.site.register(Actividad)
admin.site.register(Inscripcion)
#admin.site.register(Pago)
admin.site.register(Cuota)
admin.site.register(CompensacionStaff)