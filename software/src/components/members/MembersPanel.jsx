import React, { useState } from 'react';

const MembersPanel = ({ 
  members, 
  onViewMemberData, 
  onViewMemberActivities, 
  onEditMember, 
  onDeleteMember, 
  onCreateMember,
  showCreateButton = false,
  deleteMember, // Para mantener compatibilidad
  setShowMemberModal // Para mantener compatibilidad
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateMember = () => {
    if (onCreateMember) {
      onCreateMember();
    } else if (setShowMemberModal) {
      setShowMemberModal(true);
    }
  };

  const handleDeleteMember = (memberId) => {
    if (onDeleteMember) {
      onDeleteMember(memberId);
    } else if (deleteMember) {
      deleteMember(memberId);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Socios</h2>
        <div className="flex items-center gap-4">
          <input 
            type="text"
            placeholder="Buscar socio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          />
          {(showCreateButton || setShowMemberModal) && (
            <button
              onClick={handleCreateMember}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">+</span>
              {showCreateButton ? 'Nuevo Socio' : 'Registrar Miembro'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status || 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.lastPayment || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {onViewMemberData && (
                      <button 
                        onClick={() => onViewMemberData(member)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Ver Datos
                      </button>
                    )}
                    {onViewMemberActivities && (
                      <button 
                        onClick={() => onViewMemberActivities(member)}
                        className="text-green-600 hover:text-green-800 mr-3"
                      >
                        Actividades
                      </button>
                    )}
                    {onEditMember && (
                      <button 
                        onClick={() => onEditMember(member)}
                        className="text-yellow-600 hover:text-yellow-800 mr-3"
                      >
                        Editar
                      </button>
                    )}
                    {!onEditMember && (
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                    )}
                    {member.status === 'Activo' && onDeleteMember && (
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Dar de Baja
                      </button>
                    )}
                    {(!onDeleteMember || member.status !== 'Activo') && (
                      <button 
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron miembros con ese criterio de búsqueda' : 'No hay miembros registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersPanel;