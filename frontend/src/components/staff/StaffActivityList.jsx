import React, { useState } from 'react';

const StaffActivityList = ({ myClasses }) => {
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Simular socios inscriptos para cada clase (en un sistema real vendría de la base de datos)
  const getEnrolledMembers = (classId) => {
    const mockMembers = [
      { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+1234567890', status: 'Activo' },
      { id: 2, name: 'María García', email: 'maria@email.com', phone: '+1234567891', status: 'Activo' },
      { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '+1234567892', status: 'Activo' },
      { id: 4, name: 'Ana Martínez', email: 'ana@email.com', phone: '+1234567893', status: 'Activo' },
      { id: 5, name: 'Roberto Silva', email: 'roberto@email.com', phone: '+1234567894', status: 'Activo' }
    ];
    
    // Simular diferentes cantidades de inscriptos por clase
    const enrollmentCount = Math.floor(Math.random() * 5) + 1;
    return mockMembers.slice(0, enrollmentCount);
  };

  // Filtrar y ordenar clases
  const getFilteredClasses = () => {
    let filtered = myClasses.filter(classItem => {
      const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (filterStatus !== 'todas') {
        // Simular diferentes estados de las clases
        const statuses = ['iniciada', 'finalizada', 'archivada', 'eliminada'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        matchesStatus = randomStatus === filterStatus;
      }
      
      return matchesSearch && matchesStatus;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'enrolled':
          aValue = getEnrolledMembers(a.id).length;
          bValue = getEnrolledMembers(b.id).length;
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

  const filteredClasses = getFilteredClasses();

  // Calcular métricas
  const totalClasses = filteredClasses.length;
  const totalEnrollments = filteredClasses.reduce((sum, cls) => sum + getEnrolledMembers(cls.id).length, 0);
  const averageEnrollment = totalClasses > 0 ? (totalEnrollments / totalClasses).toFixed(1) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Actividades Impartidas</h2>
        <div className="text-sm text-gray-600">
          Total: {totalClasses} actividades | {totalEnrollments} inscriptos
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actividades Activas</p>
              <p className="text-2xl font-bold text-blue-600">{totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Inscriptos</p>
              <p className="text-2xl font-bold text-green-600">{totalEnrollments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Clase</p>
              <p className="text-2xl font-bold text-purple-600">{averageEnrollment}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtrado y Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por título o instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas las Actividades</option>
              <option value="iniciada">Iniciadas</option>
              <option value="finalizada">Finalizadas</option>
              <option value="archivada">Archivadas</option>
              <option value="eliminada">Eliminadas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Título</option>
              <option value="date">Fecha</option>
              <option value="enrolled">Inscriptos</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
          </button>
        </div>
      </div>

      {/* Lista de Actividades */}
      <div className="space-y-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((classItem) => {
            const enrolledMembers = getEnrolledMembers(classItem.id);
            const enrollmentCount = enrolledMembers.length;
            
            return (
              <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Header de la Actividad */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{classItem.title}</h3>
                      <p className="text-gray-600 mt-1">{classItem.description || 'Sin descripción'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Fecha y Hora</div>
                      <div className="font-semibold text-gray-900">{classItem.date} - {classItem.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-600">Instructor: {classItem.instructor}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{enrollmentCount} inscriptos</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">Estado: Activa</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {enrollmentCount > 0 ? 'Con Inscriptos' : 'Sin Inscriptos'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lista de Socios Inscriptos */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Socios Inscriptos ({enrollmentCount})
                  </h4>
                  
                  {enrollmentCount > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledMembers.map((member) => (
                        <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{member.name}</h5>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {member.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {member.email}
                            </p>
                            <p className="flex items-center">
                              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg">No hay socios inscriptos</p>
                      <p className="text-gray-400 text-sm">Esta actividad aún no tiene participantes</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron actividades</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'todas' 
                ? 'No hay actividades que coincidan con los filtros aplicados' 
                : 'No tienes actividades asignadas actualmente'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffActivityList;