import React from "react";

/**
 * HomePanel ahora acepta `totals` desde el backend y `upcomingActivities`:
 *   totals = { socios: number, staff: number, admins: number, ingresos?: number }
 *   upcomingActivities = Array de próximas actividades (varía según el rol)
 *   myActivities = Actividades del usuario (para socio/staff)
 * Si no vienen, usa valores hardcodeados como fallback para no romper la UI.
 */
const HomePanel = ({ userRole, myClasses, payments, userName, totals, upcomingActivities = [], myActivities = [] }) => {
  const totalSocios = totals?.socios ?? 3;
  const miembrosStaff = totals?.staff ?? 3;
  const ingresosMensuales = totals?.ingresos ?? 4250;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bienvenido, {userName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {userRole === "socio" && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-1 text-sm">Clases Inscritas</h3>
                  <p className="text-2xl font-bold">{myClasses.length}</p>
                </div>
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-700 mb-1 text-sm">Estado de Cuota</h3>
                  <p className="text-lg font-bold text-green-600">
                    {payments.find((p) => p.month === "Mayo 2025")?.status === "Pendiente"
                      ? "Pendiente de Pago"
                      : "Al día"}
                  </p>
                </div>
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </>
        )}

        {userRole === "profesor" && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-1 text-sm">Mis Próximas Clases</h3>
                  <p className="text-2xl font-bold">{upcomingActivities.length}</p>
                </div>
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-700 mb-1 text-sm">Total Alumnos</h3>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {userRole === "admin" && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-1 text-sm">Total Socios</h3>
                  <p className="text-2xl font-bold">{totalSocios}</p>
                </div>
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-700 mb-1 text-sm">Ingresos Mensuales</h3>
                  <p className="text-2xl font-bold">
                    ${Number(ingresosMensuales).toLocaleString()}
                  </p>
                </div>
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-700 mb-1 text-sm">Miembros del Staff</h3>
                  <p className="text-2xl font-bold">{miembrosStaff}</p>
                </div>
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {userRole === "admin" && "Próximas Actividades (Todas)"}
          {userRole === "staff" && "Mis Próximas Actividades"}
          {userRole === "socio" && "Mis Actividades Inscritas"}
        </h3>
        {(upcomingActivities.length > 0 || myActivities.length > 0) ? (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {/* Mostrar según rol */}
            {userRole === "admin" && upcomingActivities.map((activity, index) => (
              <div 
                key={activity.id || index} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">
                  {activity.nombre} {activity.instructorName && `- ${activity.instructorName}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">{activity.inicioUI || 'Fecha por confirmar'}</p>
                {activity.cantidad_inscriptos > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {activity.cantidad_inscriptos} inscriptos
                  </p>
                )}
              </div>
            ))}
            {userRole === "staff" && myActivities.map((activity, index) => (
              <div 
                key={activity.id || index} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">{activity.title || activity.nombre}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.date && activity.time ? `${activity.date} - ${activity.time}` : activity.inicioUI || 'Fecha por confirmar'}
                </p>
                {(activity.enrolled || activity.cantidad_inscriptos > 0) && (
                  <p className="text-xs text-blue-600 mt-1">
                    {activity.enrolled || activity.cantidad_inscriptos} inscriptos
                  </p>
                )}
              </div>
            ))}
            {userRole === "socio" && myClasses.map((activity, index) => (
              <div 
                key={activity.id || index} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.date} - {activity.time}
                </p>
                {activity.enrollmentFee && (
                  <p className="text-xs text-green-600 mt-1">
                    Cargo: {activity.enrollmentFee}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">
              {userRole === "socio" ? "No tienes actividades inscritas" : "No hay actividades próximas programadas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePanel;
