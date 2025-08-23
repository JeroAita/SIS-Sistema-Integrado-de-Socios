import React from 'react';

const ConfigPanel = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Configuración del Sistema</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Configuración General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Club</label>
            <input 
              type="text" 
              defaultValue="Club Deportivo Elite"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuota Mensual ($)</label>
            <input 
              type="number" 
              defaultValue="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-blue-600 text-white py-2 px-6 rounded font-medium hover:bg-blue-700">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;