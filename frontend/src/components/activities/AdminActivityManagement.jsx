import React, { useMemo, useState } from "react";
import ActivityModal from "./ActivityModal";

/**
 * Props:
 *  - activities: array de actividades ya adaptadas
 *  - staffOptions: [{id, name}]
 *  - onActivitySave(payload, mode)
 *  - onActivityDelete(id)
 */
const AdminActivityManagement = ({ activities = [], staffOptions = [], onActivitySave, onActivityDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter(a =>
      (a.nombre || "").toLowerCase().includes(q) ||
      (a.descripcion || "").toLowerCase().includes(q)
    );
  }, [activities, search]);

  const handleCreate = () => {
    setMode("create");
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (a) => {
    setMode("edit");
    setSelected(a);
    setShowModal(true);
  };

  const handleSave = (payload, m) => {
    onActivitySave?.(payload, m);
  };

  const badge = (estado) => {
    const base = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch ((estado || "").toLowerCase()) {
      case "activa": return <span className={`${base} bg-green-100 text-green-800`}>Activa</span>;
      case "finalizada": return <span className={`${base} bg-blue-100 text-blue-800`}>Finalizada</span>;
      case "archivada": return <span className={`${base} bg-gray-200 text-gray-800`}>Archivada</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-800`}>{estado}</span>;
    }
  };

  return (
    <div className="p-6">
      {/* Header + Buscar + Botón Crear */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Actividades</h2>
        <div className="flex gap-3 items-center">
          <input
            className="px-4 py-2 border rounded w-64"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
          >
            + Crear actividad
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length ? (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="font-medium">{a.nombre}</div>
                    {a.descripcion && <div className="text-sm text-gray-500">{a.descripcion}</div>}
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm">{new Date(a.fecha_hora_inicio).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm">{new Date(a.fecha_hora_fin).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm">{a.instructorName || "-"}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm">{a.cargo_inscripcion != null ? `$ ${Number(a.cargo_inscripcion).toFixed(2)}` : "-"}</div>
                  </td>
                  <td className="px-6 py-3">{badge(a.estado)}</td>
                  <td className="px-6 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEdit(a)}>
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onActivityDelete?.(a.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="px-6 py-6 text-center text-gray-500" colSpan={7}>Sin actividades</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <ActivityModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode={mode}
          activity={selected}
          staffOptions={staffOptions}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminActivityManagement;
