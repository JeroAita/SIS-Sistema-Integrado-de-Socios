import React, { useEffect, useMemo, useState } from "react";

// Layout
import Sidebar from "./Sidebar";
import Header from "./Header";
import Notification from "../common/Notification";

// Panels
import HomePanel from "../dashboard/HomePanel";
import ClassesPanel from "../activities/ClasesPanel";
import MyClassesPanel from "../activities/MyClasesPanel";
import PaymentsPanel from "../payments/PaymentsPanel";
import MembersPanel from "../members/MembersPanel";
import StaffManagement from "../staff/StaffManagement";
import ConfigPanel from "../settings/ConfigPanel";
import AdminActivityManagement from "../activities/AdminActivityManagement";

// Modals
import MemberModal from "../members/MemberModal";
import PaymentModal from "../payments/PaymentModal";
import EnrollmentModal from "../activities/EnrollmentModal";

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
import { useAuth } from "../../contexts/AuthContext";
const DEFAULT_PASSWORD = "Club2025!";

const SportsDashboard = ({ initialView = "inicio" }) => {
  const [userRole, setUserRole] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([cargarUsuarios(), cargarStaff()]);
        await cargarActividades(); // después de staff para poder mapear instructorName
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
    } catch (error) {
      console.error("Error cargando staff:", error);
      notify("error", "No se pudo cargar la lista de staff");
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
async function cargarActividades() {
  const arr = await listarActividades();
  const withExtras = arr.map(a => {
    const estadoPlano = (a.estado || "activo").toLowerCase();
    return {
      ...a,
      // nombre y demas llegan directo del backend
      instructorName:
        staffMembers.find(s => s.id === a.usuario_staff)?.fullName ||
        staffMembers.find(s => s.id === a.usuario_staff)?.name || "—",
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

  // -------- Render ----------
  const renderPanel = () => {
    switch (activeView) {
      case "inicio":
        return (
          <HomePanel
            userRole={userRole}
            myClasses={myClasses}
            payments={payments}
            userName={
              user ? `${user.first_name} ${user.last_name}` : "Usuario"
            }
            totals={{ socios: totSocios, staff: totStaff, admins: totAdmins }}
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

case "clases":
  return <ClassesPanel classes={classes} myClasses={myClasses} />; // ← solo si querés mantener la vista vieja


      case "misClases":
        return <MyClassesPanel classes={myClasses} />;

      case "pagos":
        return <PaymentsPanel payments={payments} members={members} classes={classes} />;

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

      {/* Otros modales que ya tenías */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          members={members}
          classes={classes}
          payment={selectedPayment}
        />
      )}

      {showEnrollmentModal && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          enrollment={selectedEnrollment}
        />
      )}
    </div>
  );
};

export default SportsDashboard;
