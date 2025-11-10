import React, { useState } from 'react';

const GenerateCuotasModal = ({ isOpen, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    valorBase: '5000',
    diaVencimiento: '10'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await onGenerate(
        parseInt(formData.mes),
        parseInt(formData.anio),
        parseFloat(formData.valorBase),
        parseInt(formData.diaVencimiento)
      );
      
      setResult(response.data);
    } catch (error) {
      setResult({
        error: error.response?.data?.error || 'Error al generar cuotas',
        errores: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      valorBase: '5000',
      diaVencimiento: '10'
    });
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Generar Cuotas del Mes</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mes
                  </label>
                  <select
                    value={formData.mes}
                    onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {meses.map((mes, index) => (
                      <option key={index} value={index + 1}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Año */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <input
                    type="number"
                    value={formData.anio}
                    onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="2020"
                    max="2100"
                  />
                </div>

                {/* Valor Base */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Cuota Social ($)
                  </label>
                  <input
                    type="number"
                    value={formData.valorBase}
                    onChange={(e) => setFormData({ ...formData, valorBase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Las actividades se sumarán automáticamente
                  </p>
                </div>

                {/* Día de Vencimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Día de Vencimiento
                  </label>
                  <input
                    type="number"
                    value={formData.diaVencimiento}
                    onChange={(e) => setFormData({ ...formData, diaVencimiento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                    max="28"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Día del mes (1-28)
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Vista Previa</h4>
                <p className="text-sm text-blue-700">
                  Se generarán cuotas para <strong>todos los socios activos</strong> del período{' '}
                  <strong>{meses[parseInt(formData.mes) - 1]} {formData.anio}</strong>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Vencimiento: <strong>{formData.diaVencimiento}/{formData.mes}/{formData.anio}</strong>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Valor base: <strong>${formData.valorBase}</strong> + actividades inscritas
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Generando...' : 'Generar Cuotas'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Resultado */}
              <div className={`p-4 rounded-lg border mb-4 ${
                result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                {result.error ? (
                  <div>
                    <h4 className="font-medium text-red-900 mb-2">Error</h4>
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">✓ Proceso Completado</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-green-600">Cuotas Creadas</p>
                        <p className="text-2xl font-bold text-green-900">{result.cuotas_creadas}</p>
                      </div>
                      <div>
                        <p className="text-yellow-600">Ya Existían</p>
                        <p className="text-2xl font-bold text-yellow-900">{result.cuotas_existentes}</p>
                      </div>
                      <div>
                        <p className="text-red-600">Errores</p>
                        <p className="text-2xl font-bold text-red-900">{result.errores}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detalles */}
              {result.detalle && (
                <div className="max-h-96 overflow-y-auto">
                  {result.detalle.creadas && result.detalle.creadas.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Cuotas Creadas</h5>
                      <div className="space-y-2">
                        {result.detalle.creadas.map((item, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded border border-green-200 text-sm">
                            <div className="font-medium">{item.socio}</div>
                            <div className="text-gray-600">
                              Base: ${item.valor_base} + Actividades: ${item.valor_actividades} = 
                              <span className="font-bold"> Total: ${item.valor_total}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.num_inscripciones} actividades inscritas
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.detalle.errores && result.detalle.errores.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-red-900 mb-2">Errores</h5>
                      <div className="space-y-2">
                        {result.detalle.errores.map((item, index) => (
                          <div key={index} className="p-3 bg-red-50 rounded border border-red-200 text-sm">
                            <div className="font-medium">{item.socio}</div>
                            <div className="text-red-600">{item.error}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botón Cerrar */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateCuotasModal;

