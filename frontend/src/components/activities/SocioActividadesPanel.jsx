import React, { useState } from 'react';

const SocioActividadesPanel = ({ allActivities, myEnrollments, onEnroll, onCancelEnrollment }) => {
  const [activeTab, setActiveTab] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('todos');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Obtener instructores únicos para el filtro
  const instructors = [...new Set(allActivities.map(a => a.instructor))];

  // Obtener IDs de actividades inscritas - soportar ambos formatos y normalizar a número
  const enrolledActivityIds = myEnrollments.map(e => {
    const id = e.activityId || e.id;
    return typeof id === 'string' ? parseInt(id) : id;
  });

  // Verificar si una actividad está vencida (fecha_hora_fin anterior a ahora)
  const isActivityExpired = (activity) => {
    if (!activity.fecha_hora_fin) return false;
    try {
      const endDate = new Date(activity.fecha_hora_fin);
      // Verificar que la fecha sea válida
      if (isNaN(endDate.getTime())) return false;
      const now = new Date();
      // La actividad está vencida si la fecha de fin es anterior a ahora
      return endDate < now;
    } catch (error) {
      console.error('Error al verificar fecha de expiración:', error, activity);
      return false;
    }
  };

  // Filtrar actividades según tab activo
  const getActivitiesByTab = () => {
    const activityId = (id) => typeof id === 'string' ? parseInt(id) : id;
    
    switch (activeTab) {
      case 'inscritas':
        return allActivities.filter(a => 
          enrolledActivityIds.includes(activityId(a.id)) && !isActivityExpired(a)
        );
      case 'disponibles':
        return allActivities.filter(a => 
          !enrolledActivityIds.includes(activityId(a.id)) && !isActivityExpired(a)
        );
      case 'finalizadas':
        return allActivities.filter(a => 
          enrolledActivityIds.includes(activityId(a.id)) && isActivityExpired(a)
        );
      default: // 'todas'
        return allActivities.filter(a => !isActivityExpired(a));
    }
  };

  // Filtrar y ordenar actividades
  const getFilteredActivities = () => {
    let activities = getActivitiesByTab();

    let filtered = activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstructor = filterInstructor === 'todos' || activity.instructor === filterInstructor;
      
      return matchesSearch && matchesInstructor;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'instructor':
          aValue = a.instructor.toLowerCase();
          bValue = b.instructor.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  // Calcular estadísticas (excluyendo finalizadas)
  const totalActividades = allActivities.filter(a => !isActivityExpired(a)).length;
  
  // Filtrar inscripciones que NO están en actividades finalizadas
  const inscripcionesActivas = myEnrollments.filter(enrollment => {
    const enrollmentActId = enrollment.activityId || enrollment.id;
    const enrollmentActIdNum = typeof enrollmentActId === 'string' ? parseInt(enrollmentActId) : enrollmentActId;
    const activity = allActivities.find(a => {
      const activityId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
      return activityId === enrollmentActIdNum;
    });
    return activity && !isActivityExpired(activity);
  });
  
  const actividadesInscritas = inscripcionesActivas.length;
  const actividadesDisponibles = allActivities.filter(a => {
    const activityId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
    return !enrolledActivityIds.includes(activityId) && !isActivityExpired(a);
  }).length;
  const costoTotal = inscripcionesActivas.reduce((sum, activity) => 
    sum + parseFloat(activity.enrollmentFee?.replace('$', '') || 0), 0
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Actividades</h2>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-700 mb-1 text-sm">Total Actividades</h3>
              <p className="text-2xl font-bold">{totalActividades}</p>
            </div>
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-700 mb-1 text-sm">Inscritas</h3>
              <p className="text-2xl font-bold">{actividadesInscritas}</p>
            </div>
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-700 mb-1 text-sm">Disponibles</h3>
              <p className="text-2xl font-bold">{actividadesDisponibles}</p>
            </div>
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-700 mb-1 text-sm">Costo Total</h3>
              <p className="text-2xl font-bold">${costoTotal.toFixed(2)}</p>
            </div>
            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('todas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'todas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Todas ({allActivities.filter(a => !isActivityExpired(a)).length})
            </button>
            <button
              onClick={() => setActiveTab('inscritas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inscritas'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inscritas ({inscripcionesActivas.length})
            </button>
            <button
              onClick={() => setActiveTab('disponibles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'disponibles'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Disponibles ({allActivities.filter(a => {
                const activityId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
                return !enrolledActivityIds.includes(activityId) && !isActivityExpired(a);
              }).length})
            </button>
            <button
              onClick={() => setActiveTab('finalizadas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'finalizadas'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Finalizadas ({allActivities.filter(a => {
                const activityId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
                return enrolledActivityIds.includes(activityId) && isActivityExpired(a);
              }).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Controles de Filtrado y Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar actividad o instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <select
            value={filterInstructor}
            onChange={(e) => setFilterInstructor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos</option>
            {instructors.map(instructor => (
              <option key={instructor} value={instructor}>{instructor}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="title">Título</option>
            <option value="instructor">Instructor</option>
            <option value="date">Fecha</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title={sortOrder === 'asc' ? 'Orden Ascendente' : 'Orden Descendente'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Tabla de Actividades */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              {activeTab !== 'finalizadas' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const activityId = typeof activity.id === 'string' ? parseInt(activity.id) : activity.id;
                const isEnrolled = enrolledActivityIds.includes(activityId);
                const isFull = activity.enrolled >= activity.capacity;
                const isExpired = isActivityExpired(activity);
                
                // Buscar el objeto de inscripción para poder cancelarla
                const enrollment = myEnrollments.find(e => {
                  const enrollmentActId = e.activityId || e.id;
                  const enrollmentActIdNum = typeof enrollmentActId === 'string' ? parseInt(enrollmentActId) : enrollmentActId;
                  return enrollmentActIdNum === activityId;
                });
                
                return (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{activity.title}</div>
                        {activity.description && (
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {activity.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {activity.date} - {activity.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {activity.enrollmentFee || '$0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEnrolled ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">
                          ✓ Inscrito
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Vencida
                        </span>
                      ) : isFull ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Completo
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Disponible
                        </span>
                      )}
                    </td>
                    {activeTab !== 'finalizadas' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEnrolled ? (
                          <button
                            onClick={() => onCancelEnrollment && enrollment && onCancelEnrollment(enrollment)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <button
                            onClick={() => onEnroll(activity.id)}
                            disabled={isFull || isExpired}
                            className={`text-sm font-medium ${
                              isFull || isExpired
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            {isExpired ? 'Vencida' : isFull ? 'Completo' : 'Inscribirse'}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={activeTab === 'finalizadas' ? 5 : 6} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500">
                      {searchTerm || filterInstructor !== 'todos' 
                        ? 'No se encontraron actividades con esos criterios' 
                        : activeTab === 'inscritas'
                        ? 'No tienes actividades inscritas'
                        : activeTab === 'disponibles'
                        ? 'No hay actividades disponibles'
                        : activeTab === 'finalizadas'
                        ? 'No tienes actividades finalizadas'
                        : 'No hay actividades'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Información adicional para inscritas */}
      {activeTab === 'inscritas' && myEnrollments.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resumen de Inscripciones
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Estás inscrito en {myEnrollments.length} {myEnrollments.length === 1 ? 'actividad' : 'actividades'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">Costo Total Mensual:</p>
              <p className="text-3xl font-bold text-green-900">
                ${costoTotal.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Se suma a tu cuota base
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional para disponibles */}
      {activeTab === 'disponibles' && actividadesDisponibles > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800">
              <span className="font-semibold">{actividadesDisponibles}</span> {actividadesDisponibles === 1 ? 'actividad disponible' : 'actividades disponibles'} para inscribirte. 
              Los cargos se agregarán a tu cuota mensual.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocioActividadesPanel;

