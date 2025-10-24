from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    ActividadViewSet,
    InscripcionViewSet,
    CuotaViewSet,
    CompensacionStaffViewSet
)

# Crear instancia del router
router = DefaultRouter()

# Registrar cada ViewSet con su prefijo de URL
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'actividades', ActividadViewSet, basename='actividad')
router.register(r'inscripciones', InscripcionViewSet, basename='inscripcion')
router.register(r'cuotas', CuotaViewSet, basename='cuota')
router.register(r'compensaciones', CompensacionStaffViewSet, basename='compensacion')

urlpatterns = [
    # Incluir todas las rutas generadas por el router
    path('', include(router.urls)),
]
