import api from "./api";

// Listar cuotas con filtros opcionales
export async function listarCuotas(params = {}) {
  const { data } = await api.get("/cuotas/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

// Obtener cuotas por socio
export async function obtenerCuotasPorSocio(usuarioSocioId) {
  return listarCuotas({ usuario_socio: usuarioSocioId });
}

// Registrar pago de una cuota
export async function registrarPagoCuota(cuotaId, fechaPago = null) {
  return api.post(`/cuotas/${cuotaId}/registrar_pago/`, {
    fecha_pago: fechaPago
  });
}

// Subir comprobante de pago (nueva función)
export async function subirComprobantePago(cuotaId, file) {
  const formData = new FormData();
  formData.append('comprobante', file);
  formData.append('cuota_id', cuotaId);
  
  return api.post(`/cuotas/${cuotaId}/subir_comprobante/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Obtener cuotas atrasadas
export async function obtenerCuotasAtrasadas() {
  return api.get('/cuotas/atrasadas/');
}

// Aprobar pago de una cuota (Admin)
export async function aprobarPagoCuota(cuotaId) {
  return api.post(`/cuotas/${cuotaId}/aprobar_pago/`);
}

// Rechazar comprobante de pago (Admin)
export async function rechazarPagoCuota(cuotaId) {
  return api.post(`/cuotas/${cuotaId}/rechazar_pago/`);
}

// Generar cuotas para un período (Admin)
export async function generarCuotas(mes, anio, valorBase, diaVencimiento = 10) {
  return api.post('/cuotas/generar_cuotas/', {
    mes,
    anio,
    valor_base: valorBase,
    dia_vencimiento: diaVencimiento
  });
}

