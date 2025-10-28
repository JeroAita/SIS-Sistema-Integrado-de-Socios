import api from "./api";

// 
export async function listarUsuariosPagina(page = 1) {
  const { data } = await api.get(`/usuarios/?page=${page}`);
  return data; // { count, next, previous, results }
}

//
export async function listarTodosUsuarios() {
  let page = 1;
  let all = [];
  while (true) {
    const data = await listarUsuariosPagina(page);
    const chunk = Array.isArray(data.results) ? data.results : [];
    all = all.concat(chunk);
    if (!data.next) break;
    page += 1;
  }
  return all;
}

// Crear
export async function crearUsuario(payload) {
  const { data } = await api.post(`/usuarios/`, payload);
  return data;
}

// Actualizar 
export async function actualizarUsuario(id, payload) {
  const { data } = await api.patch(`/usuarios/${id}/`, payload);
  return data;
}

// Eliminar
export async function eliminarUsuario(id) {
  await api.delete(`/usuarios/${id}/`);
}
