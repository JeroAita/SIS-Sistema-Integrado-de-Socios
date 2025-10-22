import React from 'react';

const HomePanel = ({ userRole, myClasses, payments, userName }) => {
  const roleTitle = { admin: 'Administrador', profesor: 'Miembro del Staff', socio: 'Socio' };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bienvenido, {userName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {userRole === 'socio' && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">Clases Inscritas</h3>
              <p className="text-2xl font-bold">{myClasses.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">Estado de Cuota</h3>
              <p className="text-lg font-bold text-green-600">
                {payments.find(p => p.month === 'Mayo 2025')?.status === 'Pendiente' ? 'Pendiente de Pago' : 'Al día'}
              </p>
            </div>
          </>
        )}
        
        {userRole === 'profesor' && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">Mis Próximas Clases</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Total Alumnos</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
          </>
        )}
        
        {userRole === 'admin' && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">Total Socios</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">Ingresos Mensuales</h3>
              <p className="text-2xl font-bold">$4,250</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Miembros del Staff</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </>
        )}
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Próximas Actividades</h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <p className="font-medium">Natación - Carlos Mendoza</p>
            <p className="text-sm text-gray-600">3 de Mayo, 16:00</p>
          </div>
          <div className="p-4 border-b border-gray-200">
            <p className="font-medium">Torneo de Tenis</p>
            <p className="text-sm text-gray-600">7 de Mayo, 09:00</p>
          </div>
          <div className="p-4">
            <p className="font-medium">Yoga en el Parque</p>
            <p className="text-sm text-gray-600">10 de Mayo, 08:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;