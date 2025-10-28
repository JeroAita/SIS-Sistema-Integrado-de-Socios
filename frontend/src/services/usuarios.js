import api from "./api";


export async function listarTodosUsuarios() {
  const res = await api.get("/usuarios/");
  // si tu API usa paginación de DRF, viene con {count, results}
  return Array.isArray(res.data) ? res.data : res.data.results || [];
}

// Crea usuario NO manda es_admin/es_staff/es_socio
export async function crearUsuario(payload) {
  const res = await api.post("/usuarios/", payload);
  return res.data;
}

// Actualiza usuario (PATCH)
export async function actualizarUsuario(id, payload) {
  const res = await api.patch(`/usuarios/${id}/`, payload);
  return res.data;
}

// Elimina usuario
export async function eliminarUsuario(id) {
  const res = await api.delete(`/usuarios/${id}/`);
  return res.data;
}

// ✅ Asignar grupo (admin | staff | socio)
export async function asignarGrupoUsuario(id, grupo) {
  const res = await api.post(`/usuarios/${id}/asignar_grupo/`, { grupo });
  return res.data;
}
