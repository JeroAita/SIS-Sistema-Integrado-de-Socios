import React, { useEffect, useMemo, useState } from "react";

/**
 * Props:
 *  - isOpen, onClose
 *  - mode: 'create' | 'edit'
 *  - activity: { id, nombre, descripcion, cargo_inscripcion, fecha_hora_inicio, fecha_hora_fin, estado, usuario_staff }
 *  - staffOptions: [{id, name}]
 *  - onSave(payload, mode)
 */
const ActivityModal = ({ isOpen, onClose, mode = "create", activity, staffOptions = [], onSave }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cargo_inscripcion: "",
    fecha_hora_inicio: "",
    fecha_hora_fin: "",
    estado: "activa",
    usuario_staff: "",
  });

  // helpers para transformar ISO ⇄ datetime-local
  const toLocalInput = (iso) => {
    if (!iso) return "";
    // Cortamos a "YYYY-MM-DDTHH:mm"
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (isEdit && activity) {
      setForm({
        nombre: activity.nombre || "",
        descripcion: activity.descripcion || "",
        cargo_inscripcion: activity.cargo_inscripcion ?? "",
        fecha_hora_inicio: toLocalInput(activity.fecha_hora_inicio),
        fecha_hora_fin: toLocalInput(activity.fecha_hora_fin),
        estado: (activity.estado || "activa").toLowerCase(), // activa | finalizada | archivada
        usuario_staff: activity.usuario_staff ?? "",
      });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        cargo_inscripcion: "",
        fecha_hora_inicio: "",
        fecha_hora_fin: "",
        estado: "activa",
        usuario_staff: "",
      });
    }
  }, [isEdit, activity]);

  const canSubmit = useMemo(() => {
    return (
      form.nombre.trim() &&
      form.fecha_hora_inicio &&
      form.fecha_hora_fin &&
      form.estado &&
      String(form.usuario_staff).length > 0
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Enviamos segun back
    onSave(
      {
        ...(activity?.id ? { id: activity.id } : {}),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() ?? "",
        cargo_inscripcion: form.cargo_inscripcion === "" ? null : Number(form.cargo_inscripcion),
        // datetime-local ya viene como "YYYY-MM-DDTHH:mm" (native)
        fecha_hora_inicio: form.fecha_hora_inicio,
        fecha_hora_fin: form.fecha_hora_fin,
        estado: form.estado, // "activa" | "finalizada" | "archivada"
        usuario_staff: Number(form.usuario_staff),
      },
      mode
    );
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            {isEdit ? "Editar actividad" : "Crear actividad"}
          </h2>
          <button className="text-2xl" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1">Descripción (nombre)*</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej: Yoga principiantes"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado*</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="activa">Activa</option>
                <option value="finalizada">Finalizada</option>
                <option value="archivada">Archivada</option>
              </select>
            </div>

            {/* Inicio */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha y hora inicio*</label>
              <input
                type="datetime-local"
                name="fecha_hora_inicio"
                value={form.fecha_hora_inicio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            {/* Fin */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha y hora fin*</label>
              <input
                type="datetime-local"
                name="fecha_hora_fin"
                value={form.fecha_hora_fin}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            {/* Cargo inscripción */}
            <div>
              <label className="block text-sm font-medium mb-1">Cargo de inscripción</label>
              <input
                type="number"
                step="0.01"
                name="cargo_inscripcion"
                value={form.cargo_inscripcion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej: 0 / 2500.00"
              />
            </div>

            {/* Staff */}
            <div>
              <label className="block text-sm font-medium mb-1">Staff responsable*</label>
              <select
                name="usuario_staff"
                value={form.usuario_staff}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">— Seleccionar —</option>
                {staffOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción larga */}
          <div>
            <label className="block text-sm font-medium mb-1">Detalle</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Opcional"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-3 py-2 text-white rounded ${canSubmit ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!canSubmit}
            >
              {isEdit ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
