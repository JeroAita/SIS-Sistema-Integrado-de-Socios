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
        <h2 className="text-2xl font-bold">Actividades Disponibles</h2>
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
                const isEnrolled = myClasses.some(c => c.activityId === classItem.id);
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
                    ? 'No se encontraron actividades con esos criterios' 
                    : 'No hay actividades disponibles'
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