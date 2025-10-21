import React from 'react';

const ProfessorProfile = ({ profile, isEditing, setIsEditing, saveProfile, setProfile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
            P
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-gray-600">Miembro del Staff</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
            <input
              type="text"
              name="specialty"
              value={profile.specialty}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
            <input
              type="text"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              name="status"
              value={profile.status}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-100"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
            >
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveProfile}
                className="bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700"
              >
                Guardar Cambios
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;