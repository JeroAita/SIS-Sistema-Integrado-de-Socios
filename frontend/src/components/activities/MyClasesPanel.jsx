import React, { useState } from 'react';

const MyClassesPanel = ({ classes, onCancelEnrollment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('todos');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Obtener instructores únicos para el filtro
  const instructors = [...new Set(classes.map(c => c.instructor))];

  // Filtrar y ordenar clases
  const getFilteredClasses = () => {
    let filtered = classes.filter(classItem => {
      const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstructor = filterInstructor === 'todos' || classItem.instructor === filterInstructor;
      
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

  const filteredClasses = getFilteredClasses();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Actividades Inscritas</h2>
        <div className="flex items-center gap-4">
          <input 
            type="text"
            placeholder="Buscar actividad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          />
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-blue-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No tienes actividades inscritas</h3>
          <p className="text-blue-700 mb-4">Explora las actividades disponibles para inscribirte y comenzar tu entrenamiento.</p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Ver Actividades Disponibles
          </button>
        </div>
      ) : (
        <>
          {/* Controles de Filtrado */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
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
                <option value="title">Ordenar por: Título</option>
                <option value="instructor">Ordenar por: Instructor</option>
                <option value="date">Ordenar por: Fecha</option>
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

          {/* Tabla de Mis Actividades */}
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
                    Cargo por Inscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{classItem.title}</div>
                          {classItem.description && (
                            <div className="text-sm text-gray-500">{classItem.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {classItem.instructor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {classItem.date} - {classItem.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {classItem.enrollmentFee || '$0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onCancelEnrollment && onCancelEnrollment(classItem)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm || filterInstructor !== 'todos' 
                        ? 'No se encontraron actividades con esos criterios' 
                        : 'No hay actividades inscritas'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen de Costos */}
          {filteredClasses.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-700 mb-1 text-sm">Resumen de Costos</h3>
                  <p className="text-green-700 text-sm">
                    Total de actividades inscritas: {filteredClasses.length}
                  </p>
                  <p className="text-2xl font-bold text-green-900 mt-2">
                    ${filteredClasses.reduce((sum, cls) => 
                      sum + parseFloat(cls.enrollmentFee?.replace('$', '') || 0), 0
                    ).toFixed(2)}
                  </p>
                </div>
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyClassesPanel;