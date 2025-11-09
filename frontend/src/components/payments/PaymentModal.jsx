import React, { useState, useEffect } from 'react';
import { obtenerCuotasPorSocio, aprobarPagoCuota } from '../../services/cuotas';

const PaymentModal = ({ isOpen, onClose, members = [], onSave }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [cuotas, setCuotas] = useState([]);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const selectedMember = members.find(m => m.id === parseInt(selectedMemberId));

  // Cargar cuotas cuando se selecciona un socio
  useEffect(() => {
    if (selectedMemberId) {
      cargarCuotasSocio();
    } else {
      setCuotas([]);
      setSelectedCuota(null);
    }
  }, [selectedMemberId]);

  const cargarCuotasSocio = async () => {
    setLoading(true);
    try {
      const cuotasData = await obtenerCuotasPorSocio(parseInt(selectedMemberId));
      setCuotas(cuotasData);
    } catch (error) {
      console.error('Error cargando cuotas:', error);
      alert('Error al cargar las cuotas del socio');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCuota) {
      alert('Por favor seleccione una cuota para aprobar el pago');
      return;
    }

    setLoading(true);
    try {
      await aprobarPagoCuota(selectedCuota.id);
      alert('Pago aprobado exitosamente');
      if (onSave) await onSave();
      handleClose();
    } catch (error) {
      console.error('Error aprobando pago:', error);
      alert('Error al aprobar el pago: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMemberId('');
    setCuotas([]);
    setSelectedCuota(null);
    onClose();
  };

  if (!isOpen) return null;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagada': return 'bg-green-100 text-green-800';
      case 'al_dia': return 'bg-green-100 text-green-800';
      case 'atrasada': return 'bg-red-100 text-red-800';
      case 'pendiente_revision': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pagada': return 'Pagada';
      case 'al_dia': return 'Al Día';
      case 'atrasada': return 'Atrasada';
      case 'pendiente_revision': return 'Pendiente Revisión';
      default: return estado;
    }
  };
  
  const puedeSeleccionarCuota = (estado) => {
    return estado === 'atrasada' || estado === 'pendiente_revision';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aprobar Pago de Cuota</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleccionar Socio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Socio *
            </label>
            <select
              required
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Seleccionar socio</option>
              {members.filter(m => m.status === 'Activo').map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.email}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar cuotas del socio */}
          {loading && selectedMemberId && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando cuotas...</p>
            </div>
          )}

          {!loading && selectedMemberId && cuotas.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No hay cuotas generadas para este socio. Primero debes generar las cuotas del mes.
              </p>
            </div>
          )}

          {!loading && cuotas.length > 0 && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Cuotas de {selectedMember?.name}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cuotas.map((cuota) => {
                    const seleccionable = puedeSeleccionarCuota(cuota.estado);
                    return (
                    <div
                      key={cuota.id}
                      onClick={() => seleccionable ? setSelectedCuota(cuota) : null}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        seleccionable ? 'cursor-pointer' : 'cursor-not-allowed'
                      } ${
                        selectedCuota?.id === cuota.id
                          ? 'border-blue-500 bg-blue-50'
                          : !seleccionable
                          ? 'border-gray-300 bg-gray-50 opacity-60'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {cuota.periodo || `${cuota.periodo_mes}/${cuota.periodo_anio}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Vencimiento: {cuota.fecha_vencimiento || '-'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getEstadoColor(cuota.estado)}`}>
                          {getEstadoTexto(cuota.estado)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-600">Valor Base:</p>
                          <p className="font-semibold">${cuota.valor_base || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Actividades:</p>
                          <p className="font-semibold">${cuota.valor_actividades || 0}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Total:</p>
                          <p className="text-lg font-bold text-blue-600">${cuota.valor_total || 0}</p>
                        </div>
                      </div>

                      {cuota.inscripciones_detalle && cuota.inscripciones_detalle.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">Actividades incluidas:</p>
                          <div className="flex flex-wrap gap-2">
                            {cuota.inscripciones_detalle.map((inscripcion, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {inscripcion.actividad_nombre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              </div>

              {selectedCuota && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    Aprobar Pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700">Período:</p>
                      <p className="font-semibold">{selectedCuota.periodo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Monto Total:</p>
                      <p className="text-xl font-bold text-green-600">${selectedCuota.valor_total}</p>
                    </div>
                    <div className="md:col-span-2 bg-green-100 p-3 rounded-md">
                      <p className="text-sm text-green-800">
                        ✓ Al confirmar, esta cuota se marcará como <strong>Pagada</strong> y se aprobará automáticamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading || !selectedCuota}
            >
              {loading ? 'Procesando...' : 'Aprobar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
