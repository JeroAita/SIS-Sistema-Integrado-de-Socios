
import api from "./api";

// devolve un ARRAY 
export async function listarStaff(params = {}) {
  const res = await api.get("/usuarios/", { params: { grupo: "staff", ...params } });
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
}


export async function crearStaff({ fullName, email, phone, dni, estado }) {
  const res = await api.post("/usuarios/", {
    fullName,
    email,
    phone,       
    dni,
    estado,      // "Activo", "Inactivo" o "Baja" 
    grupo: "staff", // clave: queda en grupo staff en la MISMA request
  });
  return res.data;
}

export async function actualizarStaff(id, payload) {
  
  const res = await api.patch(`/usuarios/${id}/`, payload);
  return res.data;
}

export async function eliminarStaff(id) {
  const res = await api.delete(`/usuarios/${id}/`);
  return res.data;
}
