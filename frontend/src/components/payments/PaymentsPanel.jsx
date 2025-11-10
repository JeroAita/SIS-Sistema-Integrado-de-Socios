import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

const PaymentsPanel = ({ 
  payments, 
  handleFileUpload, 
  submitPayment, 
  paymentFile, 
  userRole, 
  currentUserId, 
  members = [], 
  classes = [],
  onAprobarPago,
  onRechazarPago,
  onRegistrarPago,
  onGenerarCuotas
}) => {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterMonth, setFilterMonth] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCharts, setShowCharts] = useState(false);
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filtrar pagos según el rol del usuario
  const getFilteredPaymentsByRole = () => {
    if (userRole === 'socio') {
      // Socio solo ve sus propios pagos
      return payments.filter(p => p.memberId === currentUserId);
    } else if (userRole === 'staff') {
      // Staff ve pagos relacionados con sus actividades
      return payments.filter(p => p.staffId === currentUserId);
    } else {
      // Admin ve todos los pagos
      return payments;
    }
  };

  const roleFilteredPayments = getFilteredPaymentsByRole();

  // Calcular métricas según el rol
  const totalPayments = roleFilteredPayments.length;
  const paidPayments = roleFilteredPayments.filter(p => p.status === 'Pagado').length;
  const pendingPayments = roleFilteredPayments.filter(p => p.status === 'Pendiente').length;
  const overduePayments = roleFilteredPayments.filter(p => p.status === 'Atrasado').length;
  
  const totalAmount = roleFilteredPayments
    .filter(p => p.status === 'Pagado')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);
  
  const pendingAmount = roleFilteredPayments
    .filter(p => p.status === 'Pendiente')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);
  
  const overdueAmount = roleFilteredPayments
    .filter(p => p.status === 'Atrasado')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);



  // Métricas por mes
  const paymentsByMonth = months.reduce((acc, month, index) => {
    acc[month] = roleFilteredPayments.filter(p => {
      if (p.date && p.date !== '-') {
        const paymentDate = new Date(p.date);
        return paymentDate.getMonth() === index;
      }
      return false;
    }).length;
    return acc;
  }, {});

  // Filtrar y ordenar pagos
  const getFilteredPayments = () => {
    let filtered = roleFilteredPayments.filter(payment => {
      const matchesStatus = filterStatus === 'todos' || payment.status === filterStatus;
      const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (payment.activity && payment.activity.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             payment.month.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesMonth = true;
      if (filterMonth !== 'todos') {
        // Filtrar por el período de la cuota, no por la fecha de pago
        if (payment.period || payment.month) {
          const periodoTexto = (payment.period || payment.month).toLowerCase();
          const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          const mesSeleccionado = meses[parseInt(filterMonth)];
          matchesMonth = periodoTexto.includes(mesSeleccionado);
        } else {
          matchesMonth = false;
        }
      }
      
      return matchesStatus && matchesSearch && matchesMonth;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = a.date === '-' ? new Date(0) : new Date(a.date);
          bValue = b.date === '-' ? new Date(0) : new Date(b.date);
          break;
        case 'amount':
          aValue = parseFloat(a.amount.replace('$', '')) || 0;
          bValue = parseFloat(b.amount.replace('$', '')) || 0;
          break;
        case 'memberName':
          aValue = a.memberName.toLowerCase();
          bValue = b.memberName.toLowerCase();
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

  const filteredPayments = getFilteredPayments();

  // Calcular porcentajes para gráficos
  const statusPercentage = {
    pagado: totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0,
    pendiente: totalPayments > 0 ? (pendingPayments / totalPayments) * 100 : 0,
    atrasado: totalPayments > 0 ? (overduePayments / totalPayments) * 100 : 0
  };

  // Título según el rol
  const getPanelTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Panel de Gestión de Pagos';
      case 'socio':
        return 'Mis Pagos de Cuota';
      case 'staff':
        return 'Pagos de Mis Actividades';
      default:
        return 'Panel de Pagos';
    }
  };

  // Mostrar controles según el rol
  const shouldShowAdminControls = userRole === 'admin';
  const shouldShowCharts = userRole === 'admin' || userRole === 'staff';
  
  // Log para depuración
  console.log('🔑 PaymentsPanel - userRole:', userRole);
  console.log('🔑 PaymentsPanel - shouldShowAdminControls:', shouldShowAdminControls);
  console.log('🔑 PaymentsPanel - Total payments:', payments.length);

  // Función para abrir el modal de detalle de pago
  const handleOpenPaymentDetail = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetailModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{getPanelTitle()}</h2>
        <div className="flex items-center gap-4">
          {shouldShowAdminControls && (
            <>
              <button
                onClick={onGenerarCuotas}
                className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Generar Cuotas
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Aprobar Pago
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Métricas Principales - Simplificadas para socio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {userRole === 'socio' ? 'Pagos Realizados' : 'Pagos Realizados'}
              </p>
              <p className="text-2xl font-bold text-green-600">{paidPayments}</p>
              <p className="text-xs text-gray-500">{totalPayments > 0 ? `${statusPercentage.pagado.toFixed(1)}%` : '0%'}</p>
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
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              <p className="text-xs text-gray-500">{totalPayments > 0 ? `${statusPercentage.pendiente.toFixed(1)}%` : '0%'}</p>
            </div>
          </div>
        </div>

        {userRole !== 'socio' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600">Atrasados</div>
                <div className="text-2xl font-bold text-red-600">{overduePayments}</div>
                <div className="text-xs text-gray-500">{totalPayments > 0 ? `${statusPercentage.atrasado.toFixed(1)}%` : '0%'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {userRole === 'socio' ? 'Total Pagado' : 'Total Recaudado'}
              </p>
              <p className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {userRole === 'socio' ? 'Este mes' : `$${pendingAmount.toFixed(2)} pendientes`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtrado - Compactos */}
      {userRole !== 'socio' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Atrasado">Atrasado</option>
            </select>

            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos los Meses</option>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="date">Ordenar por: Fecha</option>
              <option value="amount">Ordenar por: Monto</option>
              <option value="memberName">Ordenar por: Socio</option>
              <option value="status">Ordenar por: Estado</option>
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
      )}

      {/* Tabla de Pagos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                {userRole !== 'socio' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                {userRole !== 'socio' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  {userRole !== 'socio' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.memberName}</div>
                      <div className="text-sm text-gray-500">ID: {payment.memberId}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.period || payment.month}</div>
                    <div className="text-sm text-gray-500">{payment.activity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.dueDate || '-'}</div>
                    {payment.diasAtraso > 0 && (
                      <div className="text-xs text-red-600">{payment.diasAtraso} días atraso</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.date}</div>
                    {payment.notes && (
                      <div className="text-xs text-gray-500">{payment.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'Pagado' ? 'bg-green-100 text-green-800' :
                      payment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  {userRole !== 'socio' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {shouldShowAdminControls ? (
                        <div className="flex items-center space-x-2">
                          {payment.comprobanteUrl && (
                            <a 
                              href={payment.comprobanteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 font-medium"
                              title="Ver comprobante"
                            >
                              Ver
                            </a>
                          )}
                          {payment.status === 'Pendiente' && payment.comprobanteUrl && (
                            <>
                              <button 
                                onClick={() => {
                                  console.log('Aprobando pago ID:', payment.id);
                                  onAprobarPago && onAprobarPago(payment.id);
                                }}
                                className="text-green-600 hover:text-green-900 font-medium"
                                title="Aprobar pago"
                              >
                                ✓ Aprobar
                              </button>
                              <button 
                                onClick={() => {
                                  console.log('Rechazando pago ID:', payment.id);
                                  onRechazarPago && onRechazarPago(payment.id);
                                }}
                                className="text-red-600 hover:text-red-900 font-medium"
                                title="Rechazar pago"
                              >
                                ✗ Rechazar
                              </button>
                            </>
                          )}
                          {payment.status === 'Atrasado' && !payment.comprobanteUrl && (
                            <span className="text-gray-400 text-xs">Sin comprobante</span>
                          )}
                          {payment.status === 'Pagado' && (
                            <span className="text-green-600 text-xs">✓ Aprobado</span>
                          )}
                        </div>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {userRole === 'socio' ? 'No tienes pagos registrados.' : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
          </div>
        )}
      </div>

      {/* Sección de Compensaciones para Staff */}
      {userRole === 'staff' && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-800">Mis Compensaciones</h3>
            <span className="text-sm text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
              70% de ingresos por actividades
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Total Ganado</p>
                  <p className="text-xl font-bold text-purple-800">$0.00</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-green-600">Actividades Impartidas</p>
                  <p className="text-xl font-bold text-green-800">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Próximo Pago</p>
                  <p className="text-xl font-bold text-blue-800">$0.00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
            <div className="px-4 py-3 bg-purple-50 border-b border-purple-200">
              <h4 className="font-medium text-purple-800">Historial de Compensaciones</h4>
            </div>
            <div className="p-4 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-2 text-sm">No hay compensaciones registradas</p>
              <p className="text-xs text-gray-400">Las compensaciones se calculan automáticamente por tus actividades</p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de Métricas - Simplificado para socio */}
      {userRole !== 'socio' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          

         
        </div>
      )}

      {/* Información adicional para socio */}
      {userRole === 'socio' && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Información de Cuota</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600">Último Pago</p>
              <p className="font-medium text-blue-800">1 de Abril 2025</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Estado Actual</p>
              <p className="font-medium text-green-600">Al día</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Subir Comprobante de Pago
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Pago para Socio */}
      {showPaymentDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detalle de Cuota Completa</h3>
                <button
                  onClick={() => setShowPaymentDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Información del Pago</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actividad:</span>
                      <span className="font-medium">{selectedPayment.activity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{selectedPayment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium ${
                        selectedPayment.status === 'Pagado' ? 'text-green-600' :
                        selectedPayment.status === 'Pendiente' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Desglose de Cuota Completa</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Cuota Base:</span>
                      <span className="font-medium text-blue-900">$25.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Cargo por Actividad:</span>
                      <span className="font-medium text-blue-900">$15.00</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-blue-800 font-semibold">Total Cuota Completa:</span>
                        <span className="text-blue-800 font-bold text-lg">$40.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Información Adicional</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>• La cuota completa incluye la membresía mensual y el cargo por actividad inscrita</p>
                    <p>• Los pagos se procesan automáticamente al inicio de cada mes</p>
                    <p>• Las actividades adicionales se cobran por separado</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPaymentDetailModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Pagos */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          members={members}
          onSave={async () => {
            setShowPaymentModal(false);
            if (onRegistrarPago) await onRegistrarPago();
          }}
        />
      )}
    </div>
  );
};

export default PaymentsPanel;