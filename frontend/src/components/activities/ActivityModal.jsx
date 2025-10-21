import React, { useState, useEffect } from 'react';

const ActivityModal = ({ isOpen, onClose, activity = null, mode = 'create', onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    date: '',
    time: '',
    capacity: '',
    description: '',
    enrollmentFee: '',
    staffMember: ''
  });

  useEffect(() => {
    if (activity && mode === 'edit') {
      setFormData({
        title: activity.title || '',
        instructor: activity.instructor || '',
        date: activity.date || '',
        time: activity.time || '',
        capacity: activity.capacity || '',
        description: activity.description || '',
        enrollmentFee: activity.enrollmentFee || '',
        staffMember: activity.staffMember || ''
      });
    } else {
      setFormData({
        title: '',
        instructor: '',
        date: '',
        time: '',
        capacity: '',
        description: '',
        enrollmentFee: '',
        staffMember: ''
      });
    }
  }, [activity, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, mode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Crear Nueva Actividad' : 'Editar Actividad'}
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
                Título de la Actividad *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Yoga, Natación, Tenis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor *
              </label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del instructor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo por Inscripción
              </label>
              <input
                type="text"
                value={formData.enrollmentFee}
                onChange={(e) => setFormData({...formData, enrollmentFee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: $50, Gratis"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada de la actividad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miembro del Staff Asignado
            </label>
            <input
              type="text"
              value={formData.staffMember}
              onChange={(e) => setFormData({...formData, staffMember: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Staff responsable"
            />
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
              {mode === 'create' ? 'Crear Actividad' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
