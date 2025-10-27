import { useEffect, useState } from "react";
import { listarUsuarios } from "../services/usuarios";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function cargar() {
    setLoading(true);
    try {
      const data = await listarUsuarios();
      setCount(data?.count ?? 0);
      setUsuarios(Array.isArray(data?.results) ? data.results : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-bold">Usuarios ({count})</h2>
        <button onClick={cargar} disabled={loading} className="px-2 py-1 border rounded">
          {loading ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      {usuarios.length === 0 ? (
        <p className="mt-2">No hay usuarios disponibles.</p>
      ) : (
        <ul className="mt-2 list-disc pl-6">
          {usuarios.map((u) => (
            <li key={u.id}>
              <strong>{u.username}</strong> — {u.email} — Estado: {u.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
