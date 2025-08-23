import React from 'react';

const ReportsPanel = ({ members, classes }) => {
  const activeMembers = members.filter(m => m.status === 'Activo').length;
  const totalRevenue = members.length * 50;
  const classUtilization = classes.reduce((acc, c) => acc + (c.enrolled / c.capacity), 0) / classes.length * 100;
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reportes y Estadísticas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-700 mb-2">Socios Activos</h3>
          <p className="text-2xl font-bold">{activeMembers}</p>
          <p className="text-sm text-blue-600">de {members.length} totales</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-700 mb-2">Ingresos Mensuales</h3>
          <p className="text-2xl font-bold">${totalRevenue}</p>
          <p className="text-sm text-green-600">+12% vs mes anterior</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-700 mb-2">Clases Programadas</h3>
          <p className="text-2xl font-bold">{classes.length}</p>
          <p className="text-sm text-purple-600">esta semana</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-700 mb-2">Ocupación Promedio</h3>
          <p className="text-2xl font-bold">{classUtilization.toFixed(0)}%</p>
          <p className="text-sm text-orange-600">de capacidad</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Clases Más Populares</h3>
          <div className="space-y-3">
            {classes.sort((a, b) => b.enrolled - a.enrolled).slice(0, 3).map((classItem) => (
              <div key={classItem.id} className="flex justify-between items-center">
                <span>{classItem.title}</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded mr-2">
                    <div className="h-full bg-blue-500 rounded" style={{ width: `${(classItem.enrolled / classItem.capacity) * 100}%` }} />
                  </div>
                  <span className="text-sm text-gray-600">{classItem.enrolled}/{classItem.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución de Pagos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pagos al día</span>
              <span className="text-green-600 font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span>En revisión</span>
              <span className="text-yellow-600 font-medium">10%</span>
            </div>
            <div className="flex justify-between">
              <span>Pendientes</span>
              <span className="text-red-600 font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;