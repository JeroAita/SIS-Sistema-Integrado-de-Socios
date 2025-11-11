import React, { useEffect, useMemo, useState } from "react";

// Layout
import Sidebar from "./Sidebar";
import Header from "./Header";
import Notification from "../common/Notification";

// Panels
import HomePanel from "../dashboard/HomePanel";
import ClassesPanel from "../activities/ClasesPanel";
import MyClassesPanel from "../activities/MyClasesPanel";
import SocioActividadesPanel from "../activities/SocioActividadesPanel";
import PaymentsPanel from "../payments/PaymentsPanel";
import SocioPaymentsPanel from "../payments/SocioPaymentsPanel";
import MembersPanel from "../members/MembersPanel";
import ProfilePanel from "../members/ProfilePanel";
import StaffManagement from "../staff/StaffManagement";
import StaffActivityList from "../staff/StaffActivityList";
import StaffCompensacionesPanel from "../staff/StaffCompensacionesPanel";
import ConfigPanel from "../settings/ConfigPanel";
import AdminActivityManagement from "../activities/AdminActivityManagement";

// Modals
import MemberModal from "../members/MemberModal";
import EnrollmentModal from "../activities/EnrollmentModal";
import GenerateCuotasModal from "../payments/GenerateCuotasModal";

// Servicios Usuarios (socios)
import {
  listarTodosUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  asignarGrupoUsuario,
} from "../../services/usuarios";

// Servicios Staff
import {
  listarStaff,
  crearStaff,
  actualizarStaff as actualizarStaffApi,
  eliminarStaff as eliminarStaffApi,
} from "../../services/staff";

// Servicios Actividades
import {
  listarActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "../../services/actividades";

// Servicios Inscripciones
import {
  listarInscripciones,
  crearInscripcion,
  cancelarInscripcion,
  obtenerInscripcionesPorSocio,
  obtenerInscripcionesPorActividad,
} from "../../services/inscripciones";

// Servicios Cuotas
import {
  obtenerCuotasPorSocio,
  subirComprobantePago,
  listarCuotas,
  registrarPagoCuota,
  aprobarPagoCuota,
  rechazarPagoCuota,
  generarCuotas,
} from "../../services/cuotas";

import { useAuth } from "../../hooks/useAuth";
const DEFAULT_PASSWORD = "Club2025!";

const SportsDashboard = ({ initialView = "inicio" }) => {
  const [userRole, setUserRole] = useState("");
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // Determinar el rol basado en los flags del usuario
      if (user.es_admin) {
        setUserRole('admin');
      } else if (user.es_staff) {
        setUserRole('staff');
      } else if (user.es_socio) {
        setUserRole('socio');
      } else {
        setUserRole('');
      }
    }
  }, [user]);
  
  // Reiniciar el activeView cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setActiveView(initialView);
    }
  }, [user?.id, initialView]);
  const [activeView, setActiveView] = useState(initialView);
  const [notification, setNotification] = useState(null);

  // Datos principales
  const [members, setMembers] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [activities, setActivities] = useState([]);

  // Totales para el dashboard
  const [totSocios, setTotSocios] = useState(0);
  const [totStaff, setTotStaff] = useState(0);
  const [totAdmins, setTotAdmins] = useState(0);

  // (Opcional) otras secciones
  const [classes, setClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [todasLasCuotas, setTodasLasCuotas] = useState([]); // Para admin

  // Modales de socios
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    fullName: "",
    email: "",
    phone: "",
    dni: "",
    estado: "Activo",
  });

  // Otros modales
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  
  const [showGenerateCuotasModal, setShowGenerateCuotasModal] = useState(false);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        // Cargar usuarios y staff en paralelo
        const [, staffArray] = await Promise.all([cargarUsuarios(), cargarStaff()]);
        // Cargar actividades pasando el array de staff directamente
        await cargarActividades(staffArray);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = (type, message) => setNotification({ type, message });
  const clearNotification = () => setNotification(null);

  // -------- Helpers ----------
  const toSlug = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s.]+/g, "")
      .trim();

  const splitName = (fullName) => {
    const clean = (fullName || "").trim().replace(/\s+/g, " ");
    if (!clean) return { first_name: "", last_name: "" };
    const parts = clean.split(" ");
    const first_name = parts.shift() || "";
    const last_name = parts.join(" ");
    return { first_name, last_name };
  };

  const usernameBaseFromFullName = (fullName, dni) => {
    const { first_name, last_name } = splitName(fullName);
    let base =
      [toSlug(first_name), toSlug(last_name).split(" ")[0]]
        .filter(Boolean)
        .join(".")
        .replace(/\s+/g, ".");
    if (!base || base === ".") {
      if (dni) base = `socio${String(dni).replace(/\D/g, "")}`;
      else base = `socio${Date.now()}`;
    }
    base = base.replace(/\.+/g, ".").replace(/^\./, "").replace(/\.$/, "");
    if (!base) base = `socio${Date.now()}`;
    return base;
  };

  // -------- Adaptadores UI ----------
  const adaptarSocio = (u) => ({
    id: u.id,
    name:
      (u.first_name || u.last_name)
        ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
        : u.username || "Sin nombre",
    email: u.email || "",
    phone: u.telefono || "",
    dni: u.dni || "",
    status:
      (u.estado || "activo").toLowerCase() === "activo"
        ? "Activo"
        : (u.estado || "").toLowerCase() === "inactivo"
        ? "Inactivo"
        : "Baja",
    lastPayment: "-",
    activities: [],
  });

  const adaptarStaff = (u) => {
    const fullName =
      (u.first_name || u.last_name)
        ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
        : u.username || "Sin nombre";

    const estadoPlano = String(u.estado || "activo").toLowerCase();
    const status =
      estadoPlano === "activo" ? "Activo" :
      estadoPlano === "inactivo" ? "Inactivo" : "Baja";

    return {
      id: u.id,
      fullName,
      name: fullName,
      email: u.email || "",
      phone: u.telefono || "",
      dni: u.dni || "",
      estado: status,
      status,
    };
  };

  // Selector de staff para actividades
  const staffOptions = staffMembers.map(s => ({ id: s.id, name: s.fullName || s.name }));


  // -------- API: Usuarios (Socios) ----------
  async function cargarUsuarios() {
    const usuarios = await listarTodosUsuarios();
    const socios = usuarios.filter((u) => u.es_socio === true).map(adaptarSocio);
    setMembers(socios);
    setTotSocios(socios.length);
    setTotAdmins(usuarios.filter((u) => !!u.es_admin).length);
  }

  const crearUsuarioConReintentos = async (payloadBase, base, maxIntentos = 25) => {
    for (let i = 0; i < maxIntentos; i++) {
      const username = i === 0 ? base : `${base}${i}`;
      try {
        const data = await crearUsuario({ ...payloadBase, username });
        return { ok: true, usernameCreado: username, data };
      } catch (e) {
        const b = e?.response?.data;
        if (b?.username?.length) continue;
        throw e;
      }
    }
    throw new Error("No se pudo generar un usuario único. Intenta con otro nombre/DNI.");
  };

  const handleOpenCreateMember = () => {
    setModalMode("create");
    setNewMember({ fullName: "", email: "", phone: "", dni: "", estado: "Activo" });
    setSelectedMember(null);
    setShowMemberModal(true);
  };

  const handleOpenEditMember = (member) => {
    setModalMode("edit");
    setSelectedMember(member);
    setNewMember({
      fullName: member.name ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      dni: member.dni ?? "",
      estado: member.status ?? "Activo",
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = async (formData, mode) => {
    try {
      if (mode === "create") {
        const base = usernameBaseFromFullName(formData.fullName, formData.dni);
        const { first_name, last_name } = splitName(formData.fullName);

        const payloadBase = {
          first_name,
          last_name,
          email: formData.email,
          telefono: formData.phone,
          dni: formData.dni,
          estado:
            formData.estado === "Activo" ? "activo" :
            formData.estado === "Inactivo" ? "inactivo" : "baja",
          password: DEFAULT_PASSWORD,
        };

        const res = await crearUsuarioConReintentos(payloadBase, base, 30);

        try {
          await asignarGrupoUsuario(res.data.id, "socio");
        } catch (gErr) {
          console.warn("No se pudo asignar grupo socio:", gErr?.response?.data || gErr);
        }

        notify(
          "success",
          `Socio creado. Usuario: ${res.usernameCreado} (pass: ${DEFAULT_PASSWORD})`
        );
      } else if (mode === "edit" && selectedMember) {
        const { first_name, last_name } = splitName(formData.fullName);
        await actualizarUsuario(selectedMember.id, {
          first_name,
          last_name,
          email: formData.email,
          telefono: formData.phone,
          estado: formData.estado, // el serializer normaliza
        });
        notify("success", "Socio actualizado correctamente");
      }
      setShowMemberModal(false);
      await cargarUsuarios();
    } catch (e) {
      console.error("Error al guardar:", e?.response?.data || e);
      const b = e?.response?.data;
      if (b?.username?.length) notify("error", `Usuario inválido o ya existe: ${b.username[0]}`);
      else if (b?.email?.length) notify("error", `Email inválido o ya existe: ${b.email[0]}`);
      else if (b?.dni?.length) notify("error", `DNI inválido o ya existe: ${b.dni[0]}`);
      else notify("error", "Error al guardar el socio");
    }
  };

  const handleDeleteMember = async (memberId) => {
    const ok = window.confirm("¿Eliminar este socio? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      await eliminarUsuario(memberId);
      notify("success", "Socio eliminado");
      await cargarUsuarios();
    } catch (e) {
      console.error(e);
      notify("error", "No se pudo eliminar el socio");
    }
  };

  const handleUpdateProfile = async (profileData) => {
    if (!user || !user.id) {
      notify("error", "No hay usuario autenticado");
      return;
    }
    
    try {
      const { first_name, last_name } = splitName(profileData.name);
      await actualizarUsuario(user.id, {
        first_name,
        last_name,
        email: profileData.email,
        telefono: profileData.phone,
        // dni no se puede cambiar normalmente
      });
      
      notify("success", "Perfil actualizado correctamente");
      
      // El usuario debería recargar la página o el contexto de auth debería refrescarse
    } catch (e) {
      console.error("Error al actualizar perfil:", e);
      const b = e?.response?.data;
      if (b?.email?.length) notify("error", `Email inválido: ${b.email[0]}`);
      else notify("error", "No se pudo actualizar el perfil");
    }
  };

  // -------- API: Staff ----------
  async function cargarStaff() {
    try {
      const resp = await listarStaff();
      const data = resp?.data ?? resp ?? {};
      const items = Array.isArray(data) ? data : (data.results ?? []);
      const total = typeof data?.count === "number" ? data.count : items.length;

      const staffAdaptado = items.map(adaptarStaff);
      setStaffMembers(staffAdaptado);
      setTotStaff(total);
      return staffAdaptado; // Retornar el array para usarlo inmediatamente
    } catch (error) {
      console.error("Error cargando staff:", error);
      notify("error", "No se pudo cargar la lista de staff");
      return [];
    }
  }

  async function handleCreateStaff(formData) {
    try {
      await crearStaff({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dni: formData.dni,
        estado: formData.estado || "Activo",
      });
      notify("success", "Staff creado correctamente");
      await cargarStaff();
    } catch (e) {
      console.error(e);
      const b = e?.response?.data;
      if (b?.username?.length) notify("error", `Usuario inválido o ya existe: ${b.username[0]}`);
      else if (b?.email?.length) notify("error", `Email inválido o ya existe: ${b.email[0]}`);
      else if (b?.dni?.length) notify("error", `DNI inválido o ya existe: ${b.dni[0]}`);
      else if (b?.error) notify("error", b.error);
      else notify("error", "No se pudo crear el staff");
    }
  }

  async function handleEditStaff(staffForm) {
    try {
      const { first_name, last_name } = splitName(staffForm.fullName);
      await actualizarStaffApi(staffForm.id, {
        first_name,
        last_name,
        email: staffForm.email,
        telefono: staffForm.phone,
        estado: staffForm.estado,
      });
      notify("success", "Staff actualizado correctamente");
      await cargarStaff();
    } catch (e) {
      console.error(e);
      notify("error", "No se pudo actualizar el staff");
    }
  }

  async function handleDeleteStaff(id) {
    const ok = window.confirm("¿Eliminar este miembro del staff? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      await eliminarStaffApi(id);
      notify("success", "Staff eliminado");
      await cargarStaff();
    } catch (e) {
      console.error(e);
      notify("error", "No se pudo eliminar el staff");
    }
  }

  // -------- API: Actividades ----------
function fmt(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
const toDjangoDateTime = (s) => (s ? `${s}:00` : "");
async function cargarActividades(staffArray = null) {
  const arr = await listarActividades();
  // Usar el array pasado por parámetro o el del estado
  const staffList = staffArray || staffMembers;
  
  const withExtras = arr.map(a => {
    const estadoPlano = (a.estado || "activo").toLowerCase();
    const staffMember = staffList.find(s => s.id === a.usuario_staff);
    
    return {
      ...a,
      // nombre y demas llegan directo del backend
      instructorName: staffMember?.fullName || staffMember?.name || "Por asignar",
      _raw_inicio: a.fecha_hora_inicio,
      _raw_fin: a.fecha_hora_fin,
      inicioUI: a.fecha_hora_inicio ? new Date(a.fecha_hora_inicio).toLocaleString("es-AR") : "—",
      finUI: a.fecha_hora_fin ? new Date(a.fecha_hora_fin).toLocaleString("es-AR") : "—",
      estadoUI: estadoPlano === "activo" ? "Activo" : "Inactivo",
    };
  });
  setActivities(withExtras);
}

async function handleSaveActivity(form, mode) {
  try {
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      cargo_inscripcion: form.cargo_inscripcion,
      fecha_hora_inicio: form.fecha_hora_inicio,
      fecha_hora_fin: form.fecha_hora_fin,
      estado: (form.estado || "activo").toLowerCase(),
      usuario_staff: form.usuario_staff,
    };

    if (mode === "edit" && form.id) {
      await actualizarActividad(form.id, payload);
      notify("success", "Actividad actualizada");
    } else {
      await crearActividad(payload);
      notify("success", "Actividad creada");
    }
    await cargarActividades();
  } catch (e) {
    console.error("Error guardando actividad:", e?.response?.data || e);
    const b = e?.response?.data;
    if (b?.nombre?.length) notify("error", b.nombre[0]);
    else if (b?.estado?.length) notify("error", b.estado[0]);
    else notify("error", "No se pudo guardar la actividad");
  }
}


async function handleDeleteActivity(id) {
  const ok = window.confirm("¿Eliminar esta actividad?");
  if (!ok) return;
  await eliminarActividad(id);
  notify("success", "Actividad eliminada");
  await cargarActividades();
}

  // -------- API: Inscripciones ----------
  const handleEnrollClass = async (activityId) => {
    try {
      if (!user || !user.id) {
        notify("error", "Debes iniciar sesión para inscribirte");
        return;
      }

      // Crear inscripción
      await crearInscripcion({
        usuario_socio: user.id,
        actividad: activityId,
        estado: "confirmada",
        estado_pago: "pendiente"
      });

      notify("success", "Inscripción realizada exitosamente");
      // Recargar las inscripciones del usuario
      await cargarInscripcionesUsuario();
    } catch (e) {
      console.error("Error al inscribirse:", e?.response?.data || e);
      const b = e?.response?.data;
      if (b?.error) notify("error", b.error);
      else if (b?.detail) notify("error", b.detail);
      else notify("error", "No se pudo realizar la inscripción");
    }
  };

  const handleCancelEnrollment = async (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEnrollmentModal(true);
  };

  const handleConfirmCancelEnrollment = async (enrollmentId) => {
    try {
      await cancelarInscripcion(enrollmentId);
      notify("success", "Inscripción cancelada exitosamente");
      setShowEnrollmentModal(false);
      await cargarInscripcionesUsuario();
    } catch (e) {
      console.error("Error al cancelar inscripción:", e?.response?.data || e);
      notify("error", "No se pudo cancelar la inscripción");
    }
  };

  const cargarInscripcionesUsuario = async () => {
    if (!user || !user.id) return;
    try {
      const inscripciones = await obtenerInscripcionesPorSocio(user.id);
      // Convertir inscripciones a formato de "myClasses" para la UI
      const clasesInscritas = inscripciones
        .filter(i => i.estado === "confirmada")
        .map(i => {
          const actividad = activities.find(a => a.id === i.actividad);
          if (!actividad) return null;
          
          // Extraer fecha y hora de inicioUI (formato: "dd/mm/yyyy, hh:mm")
          const inicioPartes = actividad.inicioUI?.split(',') || [];
          const fecha = inicioPartes[0]?.trim() || '-';
          const hora = inicioPartes[1]?.trim() || '-';
          
          return {
            id: i.id,
            activityId: actividad.id,
            title: actividad.nombre,
            description: actividad.descripcion,
            instructor: actividad.instructorName || 'Por asignar',
            date: fecha,
            time: hora,
            enrollmentFee: `$${actividad.cargo_inscripcion}`,
            enrolled: actividad.cantidad_inscriptos || 0,
            capacity: 999, // Si no hay límite
            estado: i.estado,
            estado_pago: i.estado_pago
          };
        })
        .filter(Boolean);
      setMyClasses(clasesInscritas);
    } catch (e) {
      console.error("Error cargando inscripciones:", e);
    }
  };

  // Cargar inscripciones cuando cambian las actividades o el usuario
  useEffect(() => {
    if (activities.length > 0 && user) {
      cargarInscripcionesUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, user]);

  // -------- API: Cuotas ----------
  const cargarCuotasUsuario = async () => {
    if (!user || !user.id) return;
    try {
      const cuotasData = await obtenerCuotasPorSocio(user.id);
      setCuotas(cuotasData);
    } catch (e) {
      console.error("Error cargando cuotas:", e);
    }
  };

  const handleUploadComprobante = async (cuotaId, file) => {
    try {
      await subirComprobantePago(cuotaId, file);
      notify("success", "Comprobante subido exitosamente. Será revisado por la administración.");
      await cargarCuotasUsuario(); // Recargar cuotas
    } catch (e) {
      console.error("Error al subir comprobante:", e);
      const b = e?.response?.data;
      if (b?.error) notify("error", b.error);
      else if (b?.detail) notify("error", b.detail);
      else notify("error", "No se pudo subir el comprobante");
      throw e; // Re-lanzar para que el componente lo maneje
    }
  };

  // Cargar cuotas cuando el usuario está disponible
  useEffect(() => {
    if (user && user.es_socio) {
      cargarCuotasUsuario();
    }
    if (user && user.es_admin) {
      cargarTodasLasCuotas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // -------- API: Todas las Cuotas (Admin) ----------
  const cargarTodasLasCuotas = async () => {
    try {
      const cuotasData = await listarCuotas();
      console.log('📊 Cuotas cargadas:', cuotasData);
      console.log('📊 Cuotas con comprobante:', cuotasData.filter(c => c.comprobante || c.comprobante_url));
      setTodasLasCuotas(cuotasData);
    } catch (e) {
      console.error("Error cargando todas las cuotas:", e);
    }
  };

  const handleRegistrarPago = async (cuotaId) => {
    try {
      await registrarPagoCuota(cuotaId, new Date().toISOString());
      notify("success", "Pago registrado correctamente");
      await cargarTodasLasCuotas();
    } catch (e) {
      console.error("Error al registrar pago:", e);
      notify("error", "No se pudo registrar el pago");
    }
  };

  const handleAprobarPago = async (cuotaId) => {
    try {
      await aprobarPagoCuota(cuotaId);
      notify("success", "Pago aprobado correctamente");
      await cargarTodasLasCuotas();
    } catch (e) {
      console.error("Error al aprobar pago:", e);
      notify("error", "No se pudo aprobar el pago");
    }
  };

  const handleRechazarPago = async (cuotaId) => {
    try {
      await rechazarPagoCuota(cuotaId);
      notify("warning", "Pago rechazado");
      await cargarTodasLasCuotas();
    } catch (e) {
      console.error("Error al rechazar pago:", e);
      notify("error", "No se pudo rechazar el pago");
    }
  };

  const handleGenerarCuotas = async (mes, anio, valorBase, diaVencimiento) => {
    try {
      const response = await generarCuotas(mes, anio, valorBase, diaVencimiento);
      notify("success", `Cuotas generadas: ${response.data.cuotas_creadas} creadas`);
      // Recargar las cuotas
      await cargarTodasLasCuotas();
      return response;
    } catch (error) {
      console.error("Error al generar cuotas:", error);
      notify("error", error.response?.data?.error || "Error al generar cuotas");
      throw error;
    }
  };

  // Convertir cuotas al formato que espera PaymentsPanel
  const convertirCuotasAPayments = () => {
    const payments = todasLasCuotas.map(cuota => {
      const socio = members.find(m => m.id === cuota.usuario_socio);
      
      // Determinar el estado basado en el estado de la cuota
      let status = 'Atrasado';
      if (cuota.estado === 'al_dia' || cuota.estado === 'al dia') {
        status = 'Pagado';
      } else if (cuota.estado === 'pendiente_revision') {
        status = 'Pendiente';
      } else if (cuota.estado === 'atrasada') {
        status = 'Atrasado';
      }
      
      // Formatear fechas
      const fechaVencimiento = new Date(cuota.fecha_vencimiento);
      const periodo = fechaVencimiento.toLocaleDateString('es-AR', { 
        month: 'long', 
        year: 'numeric' 
      });
      const fechaPago = cuota.fecha_pago 
        ? new Date(cuota.fecha_pago).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
          })
        : '-';
      
      const payment = {
        id: cuota.id,
        memberId: cuota.usuario_socio,
        memberName: socio?.name || 'Socio desconocido',
        activity: 'Cuota Mensual',
        month: periodo, // Período de la cuota
        period: periodo, // Alias para período
        amount: `$${cuota.valor_total || cuota.valor_base}`, // Usar valor total si existe
        valorBase: cuota.valor_base,
        valorActividades: cuota.valor_actividades || 0,
        valorTotal: cuota.valor_total || cuota.valor_base,
        inscripciones: cuota.inscripciones_detalle || [],
        date: fechaPago, // Fecha en que se pagó
        dueDate: fechaVencimiento.toLocaleDateString('es-AR', { // Fecha de vencimiento
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        status: status,
        paymentMethod: 'transferencia',
        notes: cuota.comprobante_url ? 'Con comprobante' : 'Sin comprobante',
        comprobanteUrl: cuota.comprobante_url,
        diasAtraso: cuota.dias_atraso || 0
      };
      
      return payment;
    });
    
    console.log('💳 Payments convertidos:', payments);
    console.log('💳 Payments con comprobante:', payments.filter(p => p.comprobanteUrl));
    console.log('💳 UserRole actual:', userRole);
    return payments;
  };

  // Convertir actividades al formato que espera ClasesPanel
  const convertirActividadesAClases = () => {
    return activities
      .filter(a => a.estado === 'activa' || a.estadoUI === 'Activo')
      .map(a => {
        const inicioPartes = a.inicioUI?.split(',') || [];
        const fecha = inicioPartes[0]?.trim() || '-';
        const hora = inicioPartes[1]?.trim() || '-';
        
        return {
          id: a.id,
          title: a.nombre,
          description: a.descripcion,
          instructor: a.instructorName || 'Por asignar',
          date: fecha,
          time: hora,
          enrollmentFee: `$${a.cargo_inscripcion}`,
          enrolled: a.cantidad_inscriptos || 0,
          capacity: 999, // Si no hay límite definido
          inscriptosDetalle: a.inscriptos_detalle || [], // Detalles de socios inscritos
          fecha_hora_fin: a._raw_fin || a.fecha_hora_fin // Fecha de fin para validar si está vencida
        };
      });
  };

  // Obtener próximas 5 actividades desde hoy
  const getUpcomingActivities = useMemo(() => {
    const now = new Date();
    return activities
      .filter(a => {
        // Filtrar solo actividades activas
        if (a.estado !== 'activa' && a.estadoUI !== 'Activo') return false;
        
        // Verificar que tengan fecha de inicio
        if (!a._raw_inicio) return false;
        
        // Filtrar solo actividades futuras o de hoy
        const fechaInicio = new Date(a._raw_inicio);
        return fechaInicio >= now;
      })
      .sort((a, b) => {
        // Ordenar por fecha de inicio (más cercana primero)
        const fechaA = new Date(a._raw_inicio);
        const fechaB = new Date(b._raw_inicio);
        return fechaA - fechaB;
      })
      .slice(0, 5); // Tomar solo las primeras 5
  }, [activities]);

  // -------- Render ----------
  const renderPanel = () => {
    switch (activeView) {
      case "inicio":
        // Determinar qué actividades mostrar según el rol
        let myActivitiesForDashboard = [];
        if (userRole === "staff") {
          // Staff ve sus propias actividades
          myActivitiesForDashboard = convertirActividadesAClases().filter(a => 
            a.instructor === `${user.first_name} ${user.last_name}`.trim()
          );
        } else if (userRole === "socio") {
          // Socio ve sus actividades inscritas
          myActivitiesForDashboard = myClasses;
        }

        return (
          <HomePanel
            userRole={userRole}
            myClasses={myClasses}
            payments={payments}
            userName={
              user ? `${user.first_name} ${user.last_name}` : "Usuario"
            }
            totals={{ socios: totSocios, staff: totStaff, admins: totAdmins }}
            upcomingActivities={getUpcomingActivities}
            myActivities={myActivitiesForDashboard}
          />
        );

      case "socios":
        return (
          <MembersPanel
            members={members}
            onCreateMember={handleOpenCreateMember}
            onEditMember={handleOpenEditMember}
            onDeleteMember={handleDeleteMember}
            showCreateButton={true}
          />
        );

      case "staff":
        return (
          <StaffManagement
            staffMembers={staffMembers}
            onStaffSave={handleCreateStaff}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
            showCreateButton={true}
          />
        );

      case "actividades":
  return (
    <AdminActivityManagement
      activities={activities}
      staffOptions={staffOptions}
      onActivitySave={handleSaveActivity}
      onActivityDelete={handleDeleteActivity}
    />
  );

case "actividades-socio":
  // Vista unificada para socios: todas las actividades
  return (
    <SocioActividadesPanel
      allActivities={convertirActividadesAClases()}
      myEnrollments={myClasses}
      onEnroll={handleEnrollClass}
      onCancelEnrollment={handleCancelEnrollment}
    />
  );

      case "misActividades":
        // Vista para staff - actividades que dicta
        return (
          <StaffActivityList 
            myClasses={convertirActividadesAClases()}
          />
        );

      case "compensaciones":
        // Vista para staff - compensaciones
        return (
          <StaffCompensacionesPanel 
            activities={convertirActividadesAClases()}
          />
        );

      case "perfil":
        // Vista de perfil para socio
        const userProfileData = {
          name: user ? `${user.first_name} ${user.last_name}` : '',
          email: user?.email || '',
          phone: user?.telefono || '',
          dni: user?.dni || '',
          address: user?.address || ''
        };
        
        return (
          <ProfilePanel 
            userProfile={userProfileData}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case "pagos":
        // Vista diferente según el rol
        if (user?.es_socio) {
          return (
            <SocioPaymentsPanel 
              cuotas={cuotas}
              onUploadComprobante={handleUploadComprobante}
            />
          );
        } else {
          // Admin o Staff
          return (
            <PaymentsPanel 
              payments={convertirCuotasAPayments()} 
              members={members} 
              classes={classes}
              userRole={userRole}
              currentUserId={user?.id}
              onAprobarPago={handleAprobarPago}
              onRechazarPago={handleRechazarPago}
              onRegistrarPago={async () => {
                await cargarTodasLasCuotas();
              }}
              onGenerarCuotas={() => setShowGenerateCuotasModal(true)}
            />
          );
        }

      case "configuracion":
        return <ConfigPanel />;

      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold">Sección en desarrollo</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className="bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto"
        style={{ width: "280px" }}
      >
        <Sidebar
          userRole={userRole}
          activeView={activeView}
          setActiveView={setActiveView}
          setUserRole={setUserRole}
        />
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

        <main className="flex-1 overflow-y-auto">{renderPanel()}</main>
      </div>

      {/* Modal Socios */}
      {showMemberModal && (
        <MemberModal
          newMember={newMember}
          setNewMember={setNewMember}
          setShowMemberModal={setShowMemberModal}
          mode={modalMode}
          onSave={(form) => handleSaveMember(form, modalMode)}
        />
      )}

      {showEnrollmentModal && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          enrollment={selectedEnrollment}
          onCancel={handleConfirmCancelEnrollment}
        />
      )}

      {showGenerateCuotasModal && (
        <GenerateCuotasModal
          isOpen={showGenerateCuotasModal}
          onClose={() => setShowGenerateCuotasModal(false)}
          onGenerate={handleGenerarCuotas}
        />
      )}
    </div>
  );
};

export default SportsDashboard;
