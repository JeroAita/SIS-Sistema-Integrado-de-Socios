import React, { useState, useEffect } from "react";

const MemberModal = ({
  newMember,
  setNewMember,
  setShowMemberModal,
  mode = "create",
  onSave,
}) => {
  const [local, setLocal] = useState({
    fullName: "",
    email: "",
    phone: "",
    dni: "",
    estado: newMember.estado || "Activo", 
  });

  useEffect(() => {
    setLocal({
      fullName: newMember?.fullName || "",
      email: newMember?.email || "",
      phone: newMember?.phone || "",
      dni: newMember?.dni || "",
      estado: newMember.estado || "Activo",
    });
  }, [newMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...local, [name]: value };
    setLocal(next);
    setNewMember?.(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(local);
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEdit ? "Editar socio" : "Crear socio"}
          </h2>
          <button className="text-2xl" onClick={() => setShowMemberModal(false)}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NOMBRE COMPLETO */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              name="fullName"
              value={local.fullName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Juan Juarez"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: <b>Juan Juarez</b>
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={local.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="correo@dominio.com"
              required
            />
          </div>

          {/* TEL */}
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              name="phone"
              value={local.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="+54 ..."
            />
          </div>

          {/* DNI (bloqueado en edición) */}
          <div>
            <label className="block text-sm font-medium mb-1">DNI</label>
            <input
              name="dni"
              value={local.dni}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="12345678"
              required
              disabled={isEdit}
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                El DNI no puede modificarse.
              </p>
            )}
          </div>
	  <label className="block text-sm font-medium mb-1">Estado</label>
<select
  name="estado"
  value={newMember.estado}
  onChange={(e) => setNewMember((m) => ({ ...m, estado: e.target.value }))}
  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
>
  <option value="Activo">Activo</option>
  <option value="Inactivo">Inactivo</option>
  <option value="Baja">Baja</option>
</select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowMemberModal(false)}
              className="px-3 py-2 border rounded"
            >
              Cancelar
            </button>
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
              {isEdit ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
