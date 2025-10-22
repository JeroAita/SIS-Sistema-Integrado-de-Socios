import React, { useState } from 'react';

const ClassesPanel = ({ classes, enrollClass, myClasses, onCancelEnrollment }) => {
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
                           classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
        case 'enrolled':
          aValue = a.enrolled || 0;
          bValue = b.enrolled || 0;
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
        <h2 className="text-2xl font-bold">Clases Disponibles</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredClasses.length} clases
        </div>
      </div>

      {/* Controles de Filtrado y Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por título, instructor o descripción..."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Título</option>
              <option value="instructor">Instructor</option>
              <option value="date">Fecha</option>
              <option value="enrolled">Inscritos</option>
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

      {/* Tabla de Clases */}
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
                Costo
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
              filteredClasses.map((classItem) => {
                const isEnrolled = myClasses.some(c => c.id === classItem.id);
                const isFull = classItem.enrolled >= classItem.capacity;
                
                return (
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
                      {isEnrolled ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Inscrito
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEnrolled ? (
                        <button
                          onClick={() => onCancelEnrollment && onCancelEnrollment(classItem)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => enrollClass(classItem.id)}
                          disabled={isFull}
                          className={`text-sm font-medium ${
                            isFull 
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {isFull ? 'Completo' : 'Inscribirse'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || filterInstructor !== 'todos' 
                    ? 'No se encontraron clases con esos criterios' 
                    : 'No hay clases disponibles'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassesPanel;