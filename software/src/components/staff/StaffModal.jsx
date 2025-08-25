import React, { useState, useEffect } from 'react';

const StaffModal = ({ isOpen, onClose, staff = null, mode = 'create', onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    experience: '',
    status: 'Activo'
  });

  useEffect(() => {
    if (staff && mode === 'edit') {
      setFormData({
        name: staff.name || '',
        specialty: staff.specialty || '',
        email: staff.email || '',
        experience: staff.experience || '',
        status: staff.status || 'Activo'
      });
    } else {
      setFormData({
        name: '',
        specialty: '',
        email: '',
        experience: '',
        status: 'Activo'
      });
    }
  }, [staff, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty || !formData.email) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const staffData = {
      id: staff ? staff.id : Date.now(),
      ...formData
    };

    onSave(staffData, mode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Registrar Nuevo Miembro del Staff' : 'Editar Miembro del Staff'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ocupación *
              </label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Instructor de Yoga, Entrenador de Natación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiencia
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 5 años, Certificado en..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Vacaciones">Vacaciones</option>
                <option value="Licencia">Licencia</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'create' ? 'Registrar Miembro' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
