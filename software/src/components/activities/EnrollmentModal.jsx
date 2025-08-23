import React from 'react';

const EnrollmentModal = ({ isOpen, onClose, enrollment, onCancel }) => {
  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar tu inscripción a esta clase?')) {
      onCancel(enrollment.id);
      onClose();
    }
  };

  if (!isOpen || !enrollment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cancelar Inscripción</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Información de la inscripción actual */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-3">
              Inscripción a Cancelar
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-red-700">Clase:</span>
                <p className="text-red-900">{enrollment.title}</p>
              </div>
              <div>
                <span className="font-medium text-red-700">Instructor:</span>
                <p className="text-red-900">{enrollment.instructor}</p>
              </div>
              <div>
                <span className="font-medium text-red-700">Fecha:</span>
                <p className="text-red-900">{enrollment.date}</p>
              </div>
              <div>
                <span className="font-medium text-red-700">Hora:</span>
                <p className="text-red-900">{enrollment.time}</p>
              </div>
            </div>
          </div>

          {/* Confirmación */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-800 font-medium">
                ¿Estás seguro de que quieres cancelar tu inscripción a esta clase?
              </p>
            </div>
            <p className="text-yellow-700 text-sm mt-2">
              Esta acción no se puede deshacer. Perderás tu lugar en la clase.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Mantener Inscripción
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Confirmar Cancelación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
