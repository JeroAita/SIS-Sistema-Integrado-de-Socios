import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../common/Notification';
import HomePanel from '../dashboard/HomePanel';
import ClassesPanel from '../activities/ClasesPanel';
import MyClassesPanel from '../activities/MyClasesPanel';
import PaymentsPanel from '../payments/PaymentsPanel';
import MembersPanel from '../members/MembersPanel';
import InstructorsPanel from '../staff/InstructorsPanel';

import ConfigPanel from '../settings/ConfigPanel';
import MemberModal from '../members/MemberModal';
import ProfessorProfile from '../staff/ProfesorProfile';
import AdminSocioHistory from '../members/AdminSocioHistory';
import StaffActivityList from '../staff/StaffActivityList';
import AdminActivityManagement from '../activities/AdminActivityManagement';
import ActivityModal from '../activities/ActivityModal';
import PaymentModal from '../payments/PaymentModal';
import EnrollmentModal from '../activities/EnrollmentModal';
import StaffCompensation from '../staff/StaffCompensation';
import StaffManagement from '../staff/StaffManagement';
import ProfilePanel from '../members/ProfilePanel';

const SportsDashboard = () => {
    const [userRole, setUserRole] = useState('admin'); // Cambio por defecto a admin
    const [activeView, setActiveView] = useState('inicio');
    const [notification, setNotification] = useState(null);
    const [classes, setClasses] = useState([
        { id: 1, title: 'Yoga', instructor: 'Ana García', date: '2025-07-15', time: '10:00', capacity: 15, enrolled: 8, description: 'Clase de yoga para principiantes', enrollmentFee: '$25', staffMember: 'Ana García' },
        { id: 2, title: 'Natación', instructor: 'Carlos Mendoza', date: '2025-07-20', time: '16:00', capacity: 10, enrolled: 10, description: 'Clase de natación técnica', enrollmentFee: '$30', staffMember: 'Carlos Mendoza' },
        { id: 3, title: 'Tenis', instructor: 'Laura Pérez', date: '2025-08-05', time: '09:00', capacity: 8, enrolled: 5, description: 'Clase de tenis intermedio', enrollmentFee: '$40', staffMember: 'Laura Pérez' },
        { id: 4, title: 'Fútbol', instructor: 'Roberto Suárez', date: '2025-08-12', time: '18:00', capacity: 22, enrolled: 18, description: 'Entrenamiento de fútbol', enrollmentFee: '$35', staffMember: 'Roberto Suárez' },
        { id: 5, title: 'Pilates', instructor: 'María López', date: '2025-07-25', time: '14:00', capacity: 12, enrolled: 6, description: 'Clase de pilates para todos los niveles', enrollmentFee: '$20', staffMember: 'María López' },
        { id: 6, title: 'Zumba', instructor: 'Ana García', date: '2025-08-18', time: '19:00', capacity: 20, enrolled: 15, description: 'Clase de zumba energética', enrollmentFee: '$15', staffMember: 'Ana García' }
    ]);
    const [myClasses, setMyClasses] = useState([
        { id: 2, title: 'Natación', instructor: 'Carlos Mendoza', date: '2025-07-20', time: '16:00', enrollmentFee: '$30', description: 'Clase de natación técnica' },
        { id: 1, title: 'Yoga', instructor: 'Ana García', date: '2025-07-15', time: '10:00', enrollmentFee: '$25', description: 'Clase de yoga para principiantes' }
    ]);
    const [payments, setPayments] = useState([
        { id: 1, memberId: 1, memberName: 'Juan Pérez', month: 'Marzo 2025', status: 'Pagado', amount: '$50', date: '2025-03-01', paymentMethod: 'efectivo', notes: 'Cuota mensual', activity: 'Cuota mensual' },
        { id: 3, memberId: 3, memberName: 'Carlos López', month: 'Mayo 2025', status: 'Pendiente', amount: '$50', date: '-', paymentMethod: '', notes: 'Cuota mensual', activity: 'Cuota mensual' },
        { id: 4, memberId: 1, memberName: 'Juan Pérez', month: 'Abril 2025', status: 'Pagado', amount: '$50', date: '2025-04-01', paymentMethod: 'transferencia', notes: 'Cuota mensual', activity: 'Cuota mensual' },
        { id: 5, memberId: 2, memberName: 'María García', month: 'Mayo 2025', status: 'Pendiente', amount: '$50', date: '-', paymentMethod: '', notes: 'Cuota mensual', activity: 'Cuota mensual' },
        { id: 6, memberId: 1, memberName: 'Juan Pérez', month: 'Julio 2025', status: 'Pagado', amount: '$80', date: '2025-07-01', paymentMethod: 'efectivo', notes: 'Cuota mensual + Natación', activity: 'Cuota + Actividad' },
        { id: 7, memberId: 1, memberName: 'Juan Pérez', month: 'Agosto 2025', status: 'Pagado', amount: '$75', date: '2025-08-01', paymentMethod: 'transferencia', notes: 'Cuota mensual + Yoga', activity: 'Cuota + Actividad' }
    ]);
    const [members, setMembers] = useState([
        { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+1234567890', status: 'Activo', lastPayment: '2025-08-10', activities: ['Natación', 'Yoga'] },
        { id: 2, name: 'María García', email: 'maria@email.com', phone: '+1234567891', status: 'Activo', lastPayment: '2025-04-01', activities: ['Tenis'] },
        { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '+1234567892', status: 'Inactivo', lastPayment: '2025-02-01', activities: [] }
    ]);
    const [instructors] = useState([
        { id: 1, name: 'Ana García', specialty: 'Yoga', email: 'ana.garcia@club.com', experience: '5 años', status: 'Activo' },
        { id: 2, name: 'Carlos Mendoza', specialty: 'Natación', email: 'carlos.mendoza@club.com', experience: '8 años', status: 'Activo' },
        { id: 3, name: 'Laura Pérez', specialty: 'Tenis', email: 'laura.perez@club.com', experience: '3 años', status: 'Activo' }
    ]);
    
    const [staffMembers, setStaffMembers] = useState([
        { id: 1, name: 'Ana García', specialty: 'Yoga', email: 'ana.garcia@club.com', experience: '5 años', status: 'Activo' },
        { id: 2, name: 'Carlos Mendoza', specialty: 'Natación', email: 'carlos.mendoza@club.com', experience: '8 años', status: 'Activo' },
        { id: 3, name: 'Laura Pérez', specialty: 'Tenis', email: 'laura.perez@club.com', experience: '3 años', status: 'Activo' },
        { id: 4, name: 'Roberto Suárez', specialty: 'Fútbol', email: 'roberto.suarez@club.com', experience: '10 años', status: 'Activo' },
        { id: 5, name: 'María López', specialty: 'Pilates', email: 'maria.lopez@club.com', experience: '6 años', status: 'Activo' }
    ]);
    
    const [compensations, setCompensations] = useState([
        { id: 1, staffId: 1, staffName: 'Ana García', amount: '$50', type: 'clase', date: '2025-01-15', description: 'Clase de Yoga', notes: 'Clase regular' },
        { id: 2, staffId: 1, staffName: 'Ana García', amount: '$75', type: 'bonus', date: '2025-01-20', description: 'Bono por rendimiento', notes: 'Excelente trabajo' },
        { id: 3, staffId: 2, staffName: 'Carlos Mendoza', amount: '$60', type: 'clase', date: '2025-01-16', description: 'Clase de Natación', notes: 'Clase técnica' }
    ]);
    const [paymentFile, setPaymentFile] = useState(null);
    
    // Estados para modales del administrador
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showMemberDataModal, setShowMemberDataModal] = useState(false);
    const [showMemberActivitiesModal, setShowMemberActivitiesModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    
    const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });
    const [newPayment, setNewPayment] = useState({ memberId: '', amount: '', month: '' });
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    
    const [professorProfile, setProfessorProfile] = useState(instructors.find(i => i.name === 'Prof. Martínez') || { name: 'Prof. Martínez', specialty: '', email: '', experience: '', status: 'Activo' });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSocio, setSelectedSocio] = useState(null);
    const [userProfile, setUserProfile] = useState({
      name: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+1234567890',
      dni: '12345678',
      address: 'Calle Principal 123, Ciudad',
      emergencyContact: 'María Pérez',
      emergencyPhone: '+1234567891',
      medicalInfo: 'Ninguna condición médica conocida',
      preferences: 'Actividades de cardio y fuerza, horarios matutinos'
    });

    // Funciones para gestión de socios
    const handleCreateMember = () => {
        if (newMember.name && newMember.email && newMember.phone) {
            const member = {
                id: members.length + 1,
                ...newMember,
                status: 'Activo',
                lastPayment: '-',
                activities: []
            };
            setMembers([...members, member]);
            setNewMember({ name: '', email: '', phone: '' });
            setShowMemberModal(false);
            setNotification({ type: 'success', message: 'Socio creado exitosamente' });
        }
    };

    const handleEditMember = () => {
        if (selectedMember && newMember.name && newMember.email && newMember.phone) {
            const updatedMembers = members.map(member => 
                member.id === selectedMember.id 
                    ? { ...member, ...newMember }
                    : member
            );
            setMembers(updatedMembers);
            setNewMember({ name: '', email: '', phone: '' });
            setSelectedMember(null);
            setShowMemberModal(false);
            setModalMode('create');
            setNotification({ type: 'success', message: 'Socio actualizado exitosamente' });
        }
    };

    const handleDeleteMember = (memberId) => {
        const updatedMembers = members.map(member => 
            member.id === memberId 
                ? { ...member, status: 'Inactivo' }
                : member
        );
        setMembers(updatedMembers);
        setNotification({ type: 'success', message: 'Socio dado de baja exitosamente' });
    };

    const handleEditMemberClick = (member) => {
        setSelectedMember(member);
        setNewMember({ name: member.name, email: member.email, phone: member.phone });
        setModalMode('edit');
        setShowMemberModal(true);
    };

    const handleViewMemberData = (member) => {
        setSelectedMember(member);
        setShowMemberDataModal(true);
    };

    const handleViewMemberActivities = (member) => {
        setSelectedMember(member);
        setShowMemberActivitiesModal(true);
    };

    // Funciones para gestión de pagos
    const handleCreatePayment = (paymentData, mode) => {
        if (mode === 'create') {
            setPayments([...payments, paymentData]);
            
            // Actualizar último pago del socio
            const updatedMembers = members.map(m => 
                m.id === paymentData.memberId 
                    ? { ...m, lastPayment: paymentData.date }
                    : m
            );
            setMembers(updatedMembers);
            
            setNotification({ type: 'success', message: 'Pago registrado exitosamente' });
        } else if (mode === 'edit') {
            const updatedPayments = payments.map(p => 
                p.id === paymentData.id ? paymentData : p
            );
            setPayments(updatedPayments);
            setNotification({ type: 'success', message: 'Pago actualizado exitosamente' });
        }
    };

    const handleValidatePayment = (paymentId) => {
        const updatedPayments = payments.map(payment => 
            payment.id === paymentId 
                ? { ...payment, status: 'Validado' }
                : payment
        );
        setPayments(updatedPayments);
        setNotification({ type: 'success', message: 'Pago validado exitosamente' });
    };

    const handleEditPayment = (payment) => {
        setSelectedPayment(payment);
        setShowPaymentModal(true);
    };

    // Funciones para gestión de actividades
    const handleActivitySave = (activityData, mode) => {
        if (mode === 'create') {
            const newActivity = {
                id: classes.length + 1,
                ...activityData,
                enrolled: 0,
                status: 'Activo'
            };
            setClasses([...classes, newActivity]);
            setNotification({ type: 'success', message: 'Actividad creada exitosamente' });
        } else if (mode === 'edit') {
            const updatedClasses = classes.map(c => 
                c.id === selectedActivity.id ? { ...c, ...activityData } : c
            );
            setClasses(updatedClasses);
            setNotification({ type: 'success', message: 'Actividad actualizada exitosamente' });
        }
    };

    const handleStaffSave = (staffData, mode) => {
        if (mode === 'create') {
            const newStaff = {
                id: staffMembers.length + 1,
                ...staffData
            };
            setStaffMembers([...staffMembers, newStaff]);
            setNotification({ type: 'success', message: 'Miembro del staff registrado exitosamente' });
        } else if (mode === 'edit') {
            const updatedStaff = staffMembers.map(staff => 
                staff.id === staffData.id 
                    ? { ...staff, ...staffData }
                    : staff
            );
            setStaffMembers(updatedStaff);
            setNotification({ type: 'success', message: 'Miembro del staff actualizado exitosamente' });
        }
    };



    const handleUnsubscribeFromActivity = (memberId, activityName) => {
        const updatedMembers = members.map(member => 
            member.id === memberId 
                ? { ...member, activities: member.activities.filter(act => act !== activityName) }
                : member
        );
        setMembers(updatedMembers);
        setNotification({ type: 'success', message: 'Socio dado de baja de la actividad exitosamente' });
    };

    // Función para actualizar el perfil del socio
    const handleUpdateProfile = (updatedProfile) => {
        setUserProfile(updatedProfile);
        setNotification({ type: 'success', message: 'Perfil actualizado exitosamente' });
    };

    // Función para cancelar inscripciones
    const handleEnrollmentCancellation = (enrollmentId) => {
        // Remover de myClasses
        const updatedMyClasses = myClasses.filter(cls => cls.id !== enrollmentId);
        setMyClasses(updatedMyClasses);
        
        // Actualizar contador de inscritos en la clase principal
        const updatedClasses = classes.map(cls => 
            cls.id === enrollmentId 
                ? { ...cls, enrolled: Math.max(0, (cls.enrolled || 0) - 1) }
                : cls
        );
        setClasses(updatedClasses);
        
        setNotification({ type: 'success', message: 'Inscripción cancelada exitosamente' });
    };

    // Función para abrir modal de cancelación
    const handleOpenCancelModal = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowEnrollmentModal(true);
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const renderPanel = () => {
        switch (activeView) {
            case 'inicio':
                                 return <HomePanel userRole={userRole} myClasses={myClasses} payments={payments} userName={userRole === 'admin' ? 'Administrador' : userRole === 'profesor' ? 'Staff' : 'Juan Pérez'} />;
            
            case 'clases':
                if (userRole === 'socio') {
                    return <ClassesPanel 
                        classes={classes} 
                        myClasses={myClasses} 
                        onCancelEnrollment={handleOpenCancelModal}
                    />;
                } else {
                    return <AdminActivityManagement classes={classes} onActivitySave={handleActivitySave} />;
                }
            
            case 'misClases':
                return <MyClassesPanel 
                    classes={myClasses} 
                    onCancelEnrollment={handleOpenCancelModal}
                />;
            
            case 'pagos':
                return (
                    <PaymentsPanel 
                        payments={payments} 
                        paymentFile={paymentFile}
                        userRole={userRole}
                        currentUserId={userRole === 'socio' ? 1 : userRole === 'staff' ? 1 : null}
                        members={members}
                        classes={classes}
                    />
                );
            
            case 'staff':
                if (userRole === 'admin') {
                    return (
                        <StaffManagement 
                            staffMembers={staffMembers} 
                            onStaffSave={handleStaffSave}
                        />
                    );
                }
                return <div className="p-6"><h2 className="text-xl font-semibold">Acceso denegado</h2></div>;
            
            case 'socios':
                if (userRole === 'admin') {
                    return (
                        <MembersPanel 
                            members={members}
                            onViewMemberData={handleViewMemberData}
                            onViewMemberActivities={handleViewMemberActivities}
                            onEditMember={handleEditMemberClick}
                            onDeleteMember={handleDeleteMember}
                            onCreateMember={() => {
                                setModalMode('create');
                                setNewMember({ name: '', email: '', phone: '' });
                                setShowMemberModal(true);
                            }}
                            showCreateButton={true}
                        />
                    );
                }
                return <MembersPanel members={members} />;
            

            
            case 'configuracion':
                return <ConfigPanel />;
            
            case 'crearClase':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Crear Nueva Clase</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" value="Prof. Martínez" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                                    <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                                </div>
                            </form>
                        </div>
                    </div>
                );
            
            case 'asistencia':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Registrar Asistencia</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 bg-gray-50" disabled>
                                <option>Selecciona una clase</option>
                                {myClasses.map((classItem) => (
                                    <option key={classItem.id} value={classItem.id}>{classItem.title} - {classItem.date} {classItem.time}</option>
                                ))}
                            </select>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alumnos Presentes</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'horario':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Mi Horario</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clase</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myClasses.map((classItem) => (
                                        <tr key={classItem.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(classItem.date).toLocaleDateString('es-ES', { weekday: 'long' })}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{classItem.time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{classItem.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case 'perfil':
                if (userRole === 'profesor') {
                    return <ProfessorProfile profile={professorProfile} isEditing={isEditing} setIsEditing={setIsEditing} />;
                } else if (userRole === 'socio') {
                    return <ProfilePanel userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
                }
                return <div className="p-6"><h2 className="text-xl font-semibold">Contenido en desarrollo</h2></div>;
            
            case 'staffActivities':
                return <StaffActivityList myClasses={myClasses} />;
            
            case 'staffCompensation':
                return <StaffCompensation myClasses={myClasses} compensations={compensations} />;
            
            default:
                return <div className="p-6"><h2 className="text-xl font-semibold">Contenido en desarrollo</h2></div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto" style={{ width: '280px' }}>
                <Sidebar userRole={userRole} activeView={activeView} setActiveView={setActiveView} setUserRole={setUserRole} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header userRole={userRole} activeView={activeView} />
                {notification && (
                    <Notification 
                        type={notification.type} 
                        message={notification.message} 
                        onClose={clearNotification}
                        autoClose={true}
                        duration={5000}
                    />
                )}
                <main className="flex-1 overflow-y-auto">
                    {renderPanel()}
                </main>
            </div>
            
            {/* Modales */}
            {showMemberModal && (
                <MemberModal 
                    newMember={newMember} 
                    setNewMember={setNewMember} 
                    setShowMemberModal={setShowMemberModal}
                    mode={modalMode}
                    onSave={modalMode === 'create' ? handleCreateMember : handleEditMember}
                />
            )}
            
            {showPaymentModal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    members={members}
                    classes={classes}
                    onSave={handleCreatePayment}
                    payment={selectedPayment}
                    mode={selectedPayment ? 'edit' : 'create'}
                />
            )}
            
            {showMemberDataModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Datos del Socio</h2>
                            <button
                                onClick={() => setShowMemberDataModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <input type="text" value={selectedMember.name} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value={selectedMember.email} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                <input type="tel" value={selectedMember.phone} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <span className={`px-2 py-1 text-xs rounded-full ${selectedMember.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {selectedMember.status}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Último Pago</label>
                                <input type="text" value={selectedMember.lastPayment} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {showMemberActivitiesModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Actividades del Socio</h2>
                            <button
                                onClick={() => setShowMemberActivitiesModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Actividades Inscritas:</h3>
                            {selectedMember.activities.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedMember.activities.map((activity, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span>{activity}</span>
                                            <button
                                                onClick={() => {
                                                    handleUnsubscribeFromActivity(selectedMember.id, activity);
                                                    setShowMemberActivitiesModal(false);
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Dar de Baja
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No hay actividades inscritas</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cancelación de Inscripciones */}
            {showEnrollmentModal && selectedEnrollment && (
                <EnrollmentModal
                    isOpen={showEnrollmentModal}
                    onClose={() => setShowEnrollmentModal(false)}
                    enrollment={selectedEnrollment}
                    onCancel={handleEnrollmentCancellation}
                />
            )}
        </div>
    );
};

export default SportsDashboard;