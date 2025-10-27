import { resumenRoles } from "./usuarios";

export async function getDashboardSummary() {
  const roles = await resumenRoles();
  return {
    totalSocios: roles.socios,
    miembrosStaff: roles.staff,
    totalAdmins: roles.admin,
    ingresosMensuales: 0,          // cuando tengas /pagos/ lo conectamos aquí
    proximasActividades: [],       // cuando tengas /actividades/ lo conectamos aquí
  };
}
