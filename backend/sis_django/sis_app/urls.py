from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    ActividadViewSet,
    InscripcionViewSet,
    CuotaViewSet,
    CompensacionStaffViewSet,
    LoginView,
    LogoutView,
    UserProfileView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
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
    # Autenticación personalizada
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    # JWT estándar (mantener por compatibilidad)
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
