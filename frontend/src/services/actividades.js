import api from "./api"; 

export async function listarActividades(params = {}) {
  const { data } = await api.get("/actividades/", { params });
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function crearActividad(payload) {
  // payload: { nombre, descripcion, cargo_inscripcion, fecha_hora_inicio, fecha_hora_fin, estado, usuario_staff }
  return api.post("/actividades/", payload);
}

export async function actualizarActividad(id, payload) {
  return api.put(`/actividades/${id}/`, payload);
}

export async function eliminarActividad(id) {
  return api.delete(`/actividades/${id}/`);
}
