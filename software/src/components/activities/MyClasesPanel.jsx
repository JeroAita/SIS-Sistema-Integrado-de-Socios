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
        <h2 className="text-2xl font-bold">Mis Clases Inscritas</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredClasses.length} clases inscritas
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-blue-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No tienes clases inscritas</h3>
          <p className="text-blue-700 mb-4">Explora las clases disponibles para inscribirte y comenzar tu entrenamiento.</p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Ver Clases Disponibles
          </button>
        </div>
      ) : (
        <>
          {/* Controles de Filtrado y Búsqueda */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                <select
                  value={filterInstructor}
                  onChange={(e) => setFilterInstructor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los Instructores</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="title">Título</option>
                  <option value="instructor">Instructor</option>
                  <option value="date">Fecha</option>
                </select>
              </div>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
              </button>
            </div>
          </div>

          {/* Tabla de Mis Clases */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clase
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
                        ? 'No se encontraron clases con esos criterios' 
                        : 'No hay clases inscritas'
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
                  <h3 className="text-lg font-semibold text-green-900">Resumen de Costos</h3>
                  <p className="text-green-700 text-sm">
                    Total de clases inscritas: {filteredClasses.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Costo Total de Inscripciones:</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${filteredClasses.reduce((sum, cls) => 
                      sum + parseFloat(cls.enrollmentFee?.replace('$', '') || 0), 0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyClassesPanel;