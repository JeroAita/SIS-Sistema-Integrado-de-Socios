import React from 'react';
import { Home, Users, User, Calendar, DollarSign, FileText, Settings, BookOpen, CheckSquare, Clock, LogOut } from 'lucide-react';

const Sidebar = ({ userRole, activeView, setActiveView, setUserRole }) => {
  const menuItems = {
    admin: [
      { id: 'socios', label: 'Socios', icon: Users },
      { id: 'staff', label: 'Staff', icon: User },
      { id: 'clases', label: 'Actividades', icon: Calendar },
      { id: 'pagos', label: 'Pagos', icon: DollarSign },
      { id: 'configuracion', label: 'Configuración', icon: Settings },
    ],
    staff: [
      { id: 'staffActivities', label: 'Mis Actividades', icon: Calendar },
      { id: 'staffCompensation', label: 'Compensaciones', icon: DollarSign },
    ],
    socio: [
      { id: 'clases', label: 'Clases Disponibles', icon: Calendar },
      { id: 'misClases', label: 'Mis Clases', icon: BookOpen },
      { id: 'pagos', label: 'Pagos de Cuota', icon: DollarSign },
      { id: 'perfil', label: 'Mi Perfil', icon: User },
    ]
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Club Deportivo</h1>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {userRole === 'admin' ? 'A' : userRole === 'staff' ? 'M' : 'S'}
          </div>
          <div className="ml-3">
            <p className="font-medium">
              {userRole === 'admin' ? 'Admin' : userRole === 'staff' ? 'Staff' : 'Juan Pérez'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2 flex-1">
        <ul>
          {menuItems[userRole].map(item => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left mb-1 transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3"><IconComponent size={20} /></span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            const newRole = userRole === 'admin' ? 'staff' : userRole === 'staff' ? 'socio' : 'admin';
            setUserRole(newRole);
            // Cambiar a la vista apropiada según el rol
            if (newRole === 'staff') {
              setActiveView('staffActivities');
            } else if (newRole === 'socio') {
              setActiveView('clases');
            } else {
              setActiveView('socios');
            }
          }}
          className="flex items-center w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 mb-2"
        >
          <span className="mr-3"><User size={20} /></span>
          Cambiar Rol
        </button>
        
        <button className="flex items-center w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">
          <span className="mr-3"><LogOut size={20} /></span>
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default Sidebar;