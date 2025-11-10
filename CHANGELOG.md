# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [2.0.0] - 2024-11-08

### ✨ Agregado

#### Sistema de Cuotas con Actividades
- **Generación automática de cuotas**: Nuevo endpoint `POST /api/cuotas/generar_cuotas/` permite generar cuotas mensuales para todos los socios activos con un solo clic
- **Cálculo automático de valores**: Las cuotas ahora incluyen automáticamente el valor base más los cargos de todas las actividades inscritas
- **Modal de generación** (`GenerateCuotasModal.jsx`): Interfaz para configurar mes, año, valor base y día de vencimiento
- **Campos nuevos en modelo `Cuota`**:
  - `inscripciones` (ManyToMany): Relación con inscripciones incluidas
  - `periodo_mes` y `periodo_anio`: Identificación de período
  - `@property valor_actividades`: Suma automática de cargos
  - `@property valor_total`: Total calculado (base + actividades)
  - Constraint `unique_together` para prevenir duplicados

#### Gestión de Pagos para Administradores
- **Aprobar pagos**: Endpoint `POST /api/cuotas/{id}/aprobar_pago/` para validar comprobantes
- **Rechazar pagos**: Endpoint `POST /api/cuotas/{id}/rechazar_pago/` para rechazar comprobantes inválidos
- **Visualización completa**: Panel centralizado con todas las cuotas de todos los socios
- **Botones de acción**: Ver comprobante, Aprobar, Rechazar en interfaz
- **Nuevas columnas**: Período, Fecha de vencimiento, Días de atraso

#### Dashboard Mejorado
- **Próximas 5 actividades**: Muestra automáticamente las actividades programadas desde hoy en adelante
- **Filtrado inteligente**: Solo muestra actividades activas y futuras, ordenadas por fecha

#### Autenticación
- **Hook `useAuth` separado**: Nuevo archivo `frontend/src/hooks/useAuth.js` para compatibilidad con Fast Refresh
- **Sistema de sesión mejorado**: Uso de `localStorage` con flag `hasSession` para prevenir re-autenticación después de logout

### 🔧 Cambiado

#### Backend
- **`CuotaSerializer`**: Agregados campos calculados `valor_actividades`, `valor_total`, `periodo`, `inscripciones_detalle`
- **`comprobante_url`**: Ahora devuelve URL absoluta completa del archivo
- **Query de socios**: Cambiado de `es_socio=True` a `groups__name='socio'` (compatibilidad con @property)

#### Frontend
- **`AuthContext.jsx`**: Implementado sistema de gestión de sesión con localStorage
- **`SportsDashboard.jsx`**: 
  - Agregada lógica de generación de cuotas
  - Cálculo de próximas 5 actividades con `useMemo`
  - Conversión de userRole desde flags (`es_admin`, `es_staff`, `es_socio`)
- **`PaymentsPanel.jsx`**: 
  - Nuevas columnas en tabla de pagos
  - Botón "Generar Cuotas del Mes"
  - Acciones contextuales según estado de cuota
- **`HomePanel.jsx`**: Ahora recibe y muestra `upcomingActivities`
- **`Login.jsx`**: Eliminado reload innecesario después de login exitoso

#### Configuración
- **Django CSRF**: Agregado puerto 5174 a `CSRF_TRUSTED_ORIGINS`
- **Django Settings**: Configurado `CSRF_COOKIE_HTTPONLY = False` para acceso desde JavaScript
- **Axios**: Agregado interceptor para manejo automático de tokens CSRF

### 🐛 Corregido

- **Fast Refresh**: Separación de hook `useAuth` del contexto para evitar error de incompatibilidad
- **Logout loop**: Sistema de localStorage previene re-autenticación automática después de cerrar sesión
- **CSRF token**: Configuración correcta de cookies y headers para peticiones POST
- **UserRole undefined**: Ahora se determina correctamente desde los flags del usuario
- **Cookies no se eliminaban**: Configuración consistente entre `set_cookie` y eliminación
- **Reloads molestos**: Eliminados recargas de página innecesarias

### 🚀 API

**Nuevos Endpoints:**
- `POST /api/cuotas/generar_cuotas/` - Generar cuotas del mes
- `POST /api/cuotas/{id}/aprobar_pago/` - Aprobar comprobante
- `POST /api/cuotas/{id}/rechazar_pago/` - Rechazar comprobante

### 📦 Archivos Nuevos

- `frontend/src/hooks/useAuth.js`
- `frontend/src/components/payments/GenerateCuotasModal.jsx`

### 📝 Archivos Modificados

**Backend:**
- `models.py` - Modelo Cuota ampliado
- `views.py` - Endpoint generar_cuotas y correcciones
- `serializers.py` - CuotaSerializer mejorado
- `settings.py` - Configuración CSRF

**Frontend:**
- `contexts/AuthContext.jsx`
- `components/auth/Login.jsx`
- `components/dashboard/HomePanel.jsx`
- `components/layout/SportsDashboard.jsx`
- `components/payments/PaymentsPanel.jsx`
- `services/api.js`
- `services/cuotas.js`

---

**Versión**: 2.0.0  
**Fecha**: 8 de Noviembre, 2024

