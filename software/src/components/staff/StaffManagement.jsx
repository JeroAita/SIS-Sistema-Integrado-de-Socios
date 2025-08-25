import React, { useState } from 'react';
import StaffModal from './StaffModal';

const StaffManagement = ({ staffMembers, onStaffSave }) => {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateStaff = () => {
    setModalMode('create');
    setSelectedStaff(null);
    setShowStaffModal(true);
  };

  const handleEditStaff = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este miembro del staff?')) {
      // Implementar lógica para eliminar staff
      console.log('Eliminar staff:', staffId);
    }
  };

  const handleSaveStaff = (staffData, mode) => {
    if (onStaffSave) {
      onStaffSave(staffData, mode);
    }
    setShowStaffModal(false);
  };

  const handleSaveCompensation = (compensationData) => {
    if (onCompensationSave) {
      onCompensationSave(compensationData);
    }
    setShowCompensationModal(false);
  };

  // Filtrar miembros del staff basado en el término de búsqueda
  const filteredStaffMembers = staffMembers.filter(staff =>
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button
            onClick={handleCreateStaff}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">+</span>
            Registrar Miembro de Staff
          </button>
        </div>
      </div>

      {/* Tabla de Miembros del Staff */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experiencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaffMembers.length > 0 ? (
              filteredStaffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{staff.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.experience}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron miembros del staff con ese criterio de búsqueda' : 'No hay miembros del staff registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar miembro del staff */}
      <StaffModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        staff={selectedStaff}
        mode={modalMode}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default StaffManagement;
