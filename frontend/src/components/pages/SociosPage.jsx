// frontend/src/components/pages/SociosPage.jsx
import { useEffect, useState } from "react";
import { listarTodosSocios } from "../../services/socios";
import MembersPanel from "../members/MembersPanel";

export default function SociosPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Adaptar usuario de la API al shape que usa MembersPanel
  const adaptarSocio = (u) => ({
    id: u.id,
    name: u.username || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "Sin nombre",
    email: u.email || "",
    phone: u.telefono || "",
    status: (u.estado || "activo").toLowerCase() === "activo" ? "Activo" : "Inactivo",
    lastPayment: "-",     // si después conectamos pagos, lo llenamos real
    activities: [],       // idem actividades
  });

  async function cargar() {
    setLoading(true);
    try {
      const sociosApi = await listarTodosSocios();
      setMembers(sociosApi.map(adaptarSocio));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">Socios ({members.length})</h1>
        <button
          onClick={cargar}
          disabled={loading}
          className="px-3 py-1 border rounded"
        >
          {loading ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      {/* MembersPanel es tu vista original; si querés botón de crear, poné showCreateButton={true} y
          luego cableamos el modal como en el dashboard */}
      <MembersPanel members={members} showCreateButton={false} />
    </div>
  );
}
