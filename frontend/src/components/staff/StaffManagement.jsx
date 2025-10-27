import React, { useState } from "react";
import StaffModal from "./StaffModal";

export default function StaffManagement({
  staffMembers = [],
  onStaffSave,             // ← importante
  onEditStaff,
  onDeleteStaff,
  showCreateButton = true,
}) {

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedStaff(null);
    setShowStaffModal(true);
  };

  const handleOpenEdit = (staff) => {
    setModalMode("edit");
    // staff ya viene adaptado con fullName, email, phone, dni, estado, etc.
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const handleRemove = (staffId) => {
    if (window.confirm("¿Está seguro de que desea eliminar este miembro del staff?")) {
      onDeleteStaff?.(staffId);
    }
  };

  // Decide qué callback llamar según el modo y pasa el id al editar
const handleSaveStaff = (formData, mode) => {
  if (mode === "edit") {
    onEditStaff?.({ ...selectedStaff, ...formData, id: selectedStaff?.id });
  } else {
    onStaffSave?.(formData, mode);  // o onCreateStaff?.(formData, mode) si tu padre usa ese nombre
  }
  setShowStaffModal(false);
};

const filteredStaffMembers = staffMembers.filter((s) => {
  const t = (searchTerm || "").toLowerCase();
  return (
    (s.name || "").toLowerCase().includes(t) ||
    (s.email || "").toLowerCase().includes(t) ||
    (s.status || s.estado || "").toLowerCase().includes(t)
  );
});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Staff</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          />
          {showCreateButton && (
<button
  type="button"
  onClick={handleOpenCreate}
  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center"
>
  <span className="mr-2">+</span>
  Registrar Miembro de Staff
</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
      </tr>
    </thead>

    <tbody className="bg-white divide-y divide-gray-200">
      {filteredStaffMembers.length === 0 ? (
        <tr>
          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
            {searchTerm
              ? "No se encontraron miembros del staff con ese criterio"
              : "No hay miembros del staff registrados"}
          </td>
        </tr>
      ) : (
        filteredStaffMembers.map((staff) => (
          <tr key={staff.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{staff.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{staff.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  (staff.status || "Activo") === "Activo"
                    ? "bg-green-100 text-green-800"
                    : (staff.status || "Activo") === "Inactivo"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {staff.status || "Activo"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => handleOpenEdit(staff)}
                className="text-blue-600 hover:text-blue-900 mr-3"
              >
                Editar
              </button>
              <button
                onClick={() => handleRemove(staff.id)}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* Modal */}
      <StaffModal
  isOpen={showStaffModal}
  onClose={() => setShowStaffModal(false)}
  staff={selectedStaff}
  mode={modalMode}
  onSave={(form) => handleSaveStaff(form, modalMode)}   // ← pasa 'mode'
/>

    </div>
  );
}
