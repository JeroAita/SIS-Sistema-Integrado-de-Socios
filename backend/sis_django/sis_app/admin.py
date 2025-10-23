from django.contrib import admin
from .models import Usuario, Actividad, Inscripcion, Cuota, CompensacionStaff #, Pago

admin.site.register(Usuario)
admin.site.register(Actividad)
admin.site.register(Inscripcion)
#admin.site.register(Pago)
admin.site.register(Cuota)
admin.site.register(CompensacionStaff)