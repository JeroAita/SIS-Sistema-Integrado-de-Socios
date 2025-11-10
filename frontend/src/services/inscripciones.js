import api from "./api";

// Listar inscripciones con filtros opcionales
export async function listarInscripciones(params = {}) {
  const { data } = await api.get("/inscripciones/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

// Crear una nueva inscripción
export async function crearInscripcion(payload) {
  // payload: { usuario_socio, actividad, estado?, estado_pago? }
  return api.post("/inscripciones/", payload);
}

// Actualizar una inscripción
export async function actualizarInscripcion(id, payload) {
  return api.put(`/inscripciones/${id}/`, payload);
}

// Eliminar una inscripción
export async function eliminarInscripcion(id) {
  return api.delete(`/inscripciones/${id}/`);
}

// Cancelar una inscripción (acción personalizada)
export async function cancelarInscripcion(id) {
  return api.post(`/inscripciones/${id}/cancelar/`);
}

// Obtener inscripciones por socio
export async function obtenerInscripcionesPorSocio(usuarioSocioId) {
  return listarInscripciones({ usuario_socio: usuarioSocioId });
}

// Obtener inscripciones por actividad
export async function obtenerInscripcionesPorActividad(actividadId) {
  return listarInscripciones({ actividad: actividadId });
}

// Obtener inscripciones por estado
export async function obtenerInscripcionesPorEstado(estado) {
  return listarInscripciones({ estado });
}


