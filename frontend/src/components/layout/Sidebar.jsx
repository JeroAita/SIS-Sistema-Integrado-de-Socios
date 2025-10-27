// frontend/src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  User,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ userRole, setUserRole }) => {
  const location = useLocation();

  const menuItems = {
    admin: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
      { id: "socios", label: "Socios", icon: Users, path: "/socios" },
      { id: "staff", label: "Staff", icon: User, path: "/staff" },
{ id: "actividades", label: "Actividades", icon: Calendar, path: "/actividades" },

      { id: "pagos", label: "Pagos", icon: DollarSign, path: "/pagos" },
      { id: "configuracion", label: "Configuración", icon: Settings, path: "/configuracion" },
    ],
    staff: [
      { id: "staffActivities", label: "Mis Actividades", icon: Calendar, path: "/mis-actividades" },
      { id: "staffCompensation", label: "Compensaciones", icon: DollarSign, path: "/compensaciones" },
    ],
    socio: [
      { id: "clases", label: "Clases Disponibles", icon: Calendar, path: "/clases" },
      { id: "misClases", label: "Mis Clases", icon: Home, path: "/mis-clases" },
      { id: "pagos", label: "Pagos de Cuota", icon: DollarSign, path: "/pagos" },
      { id: "perfil", label: "Mi Perfil", icon: User, path: "/perfil" },
    ],
  };

  const items = menuItems[userRole] || [];

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Club Deportivo</h1>
      </div>

      {/* Perfil */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {userRole === "admin" ? "A" : userRole === "staff" ? "M" : "S"}
          </div>
          <div className="ml-3">
            <p className="font-medium">
              {userRole === "admin"
                ? "Admin"
                : userRole === "staff"
                ? "Staff"
                : "Juan Pérez"}
            </p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ id, label, icon: Icon, path }) => (
          <Link
            key={id}
            to={path}
            className={`flex items-center p-2 rounded-lg transition-colors ${
              location.pathname === path
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setUserRole?.("socio")}
          className="flex items-center text-red-500 hover:text-red-700"
          type="button"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
