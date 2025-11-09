import React, { useState } from 'react';

const SocioPaymentsPanel = ({ cuotas = [], onUploadComprobante }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Solo se permiten archivos PDF, JPG o PNG');
      setSelectedFile(null);
      return;
    }

    // Validar tamaño (3MB = 3 * 1024 * 1024 bytes)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('El archivo no debe superar los 3MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = (cuota) => {
    setSelectedCuota(cuota);
    setShowUploadModal(true);
    setSelectedFile(null);
    setUploadError('');
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedCuota) {
      setUploadError('Debes seleccionar un archivo');
      return;
    }

    try {
      await onUploadComprobante(selectedCuota.id, selectedFile);
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedCuota(null);
    } catch (error) {
      setUploadError('Error al subir el comprobante. Intenta de nuevo.');
    }
  };

  // Calcular totales
  const totalPagado = cuotas.filter(c => c.estado === 'al_dia').length;
  const totalPendiente = cuotas.filter(c => c.estado === 'atrasada' || c.estado === 'pendiente_revision').length;
  const montoTotal = cuotas.reduce((sum, c) => sum + parseFloat(c.valor_base || 0), 0);
  const montoPendiente = cuotas
    .filter(c => c.estado === 'atrasada' || c.estado === 'pendiente_revision')
    .reduce((sum, c) => sum + parseFloat(c.valor_base || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Pagos de Cuota</h2>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cuotas Pagadas</p>
              <p className="text-2xl font-bold text-green-600">{totalPagado}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cuotas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{totalPendiente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total a Pagar</p>
              <p className="text-2xl font-bold text-blue-600">${montoPendiente.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Cuotas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Cuotas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
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
              {cuotas.length > 0 ? (
                cuotas.map((cuota) => (
                  <tr key={cuota.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(cuota.fecha_vencimiento).toLocaleDateString('es-AR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${parseFloat(cuota.valor_base).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(cuota.fecha_vencimiento).toLocaleDateString('es-AR')}
                      </div>
                      {cuota.dias_atraso > 0 && (
                        <div className="text-xs text-red-600">
                          {cuota.dias_atraso} días de atraso
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cuota.estado === 'al_dia' 
                          ? 'bg-green-100 text-green-800' 
                          : cuota.estado === 'pendiente_revision'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cuota.estado === 'al_dia' 
                          ? 'Pagada' 
                          : cuota.estado === 'pendiente_revision'
                          ? 'Pendiente Revisión'
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cuota.estado === 'atrasada' ? (
                        <button
                          onClick={() => handleUploadClick(cuota)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Subir Comprobante
                        </button>
                      ) : cuota.estado === 'pendiente_revision' ? (
                        <div className="text-sm">
                          <span className="text-yellow-600 font-medium">Comprobante subido</span>
                          <p className="text-xs text-gray-500">Esperando aprobación</p>
                        </div>
                      ) : cuota.fecha_pago ? (
                        <span className="text-sm text-green-600">
                          Pagado el {new Date(cuota.fecha_pago).toLocaleDateString('es-AR')}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm">No tienes cuotas registradas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Subir Comprobante */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Subir Comprobante de Pago</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedCuota && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cuota de:</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedCuota.fecha_vencimiento).toLocaleDateString('es-AR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    ${parseFloat(selectedCuota.valor_base).toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo (PDF, JPG o PNG - máx. 3MB) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFile
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Subir Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocioPaymentsPanel;

