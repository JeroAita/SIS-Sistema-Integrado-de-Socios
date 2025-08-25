import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ userRole, activeView }) => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold capitalize">
          {activeView === 'inicio' ? 'Dashboard' : activeView === 'clases' ? 'Gestión de Clases' : activeView === 'misClases' ? 'Mis Clases' : activeView === 'pagos' ? 'Pagos de Cuota' : activeView === 'socios' ? 'Gestión de Socios' : activeView === 'profesores' ? 'Gestión de Miembros del Staff' : activeView === 'reportes' ? 'Reportes y Estadísticas' : 'Configuración del Sistema'}
        </h2>
      </div>
      
      <div className="flex items-center">
        <button className="mr-4 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="mr-2">
          <p className="font-medium">
            {userRole === 'admin' ? 'Admin' : userRole === 'profesor' ? 'Staff' : 'Juan Pérez'}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;