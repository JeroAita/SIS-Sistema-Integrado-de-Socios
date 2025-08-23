import React from 'react';

const MemberModal = ({ newMember, setNewMember, setShowMemberModal, mode = 'create', onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'create' ? 'Agregar Nuevo Socio' : 'Editar Socio'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input 
              type="text"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input 
              type="email"
              required
              value={newMember.email}
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
            <input 
              type="tel"
              required
              value={newMember.phone}
              onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DNI *</label>
            <input 
              type="text"
              required
              value={newMember.dni || ''}
              onChange={(e) => setNewMember({...newMember, dni: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345678"
            />
          </div>

        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={() => setShowMemberModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {mode === 'create' ? 'Agregar' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;