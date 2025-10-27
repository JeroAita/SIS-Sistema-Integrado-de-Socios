// src/services/staff.js
import api from "./api";

// ✅ Siempre devolvemos un ARRAY (normaliza paginación DRF)
export async function listarStaff(params = {}) {
  const res = await api.get("/usuarios/", { params: { grupo: "staff", ...params } });
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
}

// ✅ Crea staff en UNA llamada, enviando los nombres que el backend entiende
export async function crearStaff({ fullName, email, phone, dni, estado }) {
  const res = await api.post("/usuarios/", {
    fullName,
    email,
    phone,       // el backend mapea phone -> telefono
    dni,
    estado,      // "Activo", "Inactivo" o "Baja" (el backend normaliza)
    grupo: "staff", // 👈 clave: queda en grupo staff en la MISMA request
  });
  return res.data;
}

export async function actualizarStaff(id, payload) {
  // Permitimos patch con los mismos nombres (fullName, phone, estado…)
  const res = await api.patch(`/usuarios/${id}/`, payload);
  return res.data;
}

export async function eliminarStaff(id) {
  const res = await api.delete(`/usuarios/${id}/`);
  return res.data;
}
