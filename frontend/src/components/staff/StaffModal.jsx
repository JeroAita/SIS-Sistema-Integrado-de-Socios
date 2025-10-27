import React, { useEffect, useState } from "react";

export default function StaffModal({
  isOpen = false,
  onClose,
  mode = "create",     // "create" | "edit"
  staff = null,        // { id, fullName, email, phone, dni, estado }
  onSave,              // (formData, mode) => void
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dni: "",
    estado: "Activo",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && staff) {
      setForm({
        fullName: staff.fullName || staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        dni: staff.dni || "",
        estado: staff.estado || staff.status || "Activo",
      });
    } else if (isOpen) {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        dni: "",
        estado: "Activo",
      });
    }
  }, [isEdit, staff, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Obligatorio";
    if (!form.email.trim()) err.email = "Obligatorio";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Email inválido";
    if (!isEdit && !form.dni.trim()) err.dni = "Obligatorio";
    if (form.dni && !/^\d{6,12}$/.test(form.dni)) err.dni = "Solo números (6–12 dígitos)";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      setSaving(true);
      await onSave?.(
        {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          dni: form.dni,
          estado: form.estado,
        },
        mode
      );
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Editar Miembro del Staff" : "Registrar Miembro del Staff"}
          </h3>
          <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej: Juan Pérez"
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="persona@correo.com"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="11 2345-6789"
              />
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-medium mb-1">DNI {isEdit ? "" : "*"}</label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Solo números"
                disabled={isEdit}
              />
              {errors.dni && <p className="text-xs text-red-600 mt-1">{errors.dni}</p>}
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">El DNI no puede modificarse.</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Registrar Miembro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
