import React from 'react';

const AdminSocioHistory = ({ socio, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Historial de {socio.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Información Personal</label>
            <p>Email: {socio.email}</p>
            <p>Teléfono: {socio.phone}</p>
            <p>Estado: <span className={socio.status === 'Activo' ? 'text-green-600' : 'text-red-600'}>{socio.status}</span></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pagos Realizados</label>
            <p>Último Pago: {socio.lastPayment || 'Sin registro'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actividades Inscriptas</label>
            <p>Ninguna (simulación)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Cuota Mensual</label>
            <p>$50 (simulación)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado de Pago</label>
            <p className={payments.find(p => p.month === 'Mayo 2025')?.status === 'Pendiente' ? 'text-red-600' : 'text-green-600'}>
              {payments.find(p => p.month === 'Mayo 2025')?.status || 'Al día'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AdminSocioHistory;