import { useState } from 'react';
import { PersonaForm } from '../features/personas/PersonaForm';
import { PersonaList } from '../features/personas/PersonaList';
import { PersonaDetail } from '../features/personas/PersonaDetail';
import { NetworkStatus } from '../components/NetworkStatus';
import { useSyncManager } from '../hooks/useSyncManager';
import { exportToCSV } from '../utils/exportUtils';
import { PlusCircle, ClipboardList, Download } from 'lucide-react';

export default function HomePage() {
  useSyncManager();
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList size={22} className="text-indigo-600" />
            <h1 className="text-base font-bold text-gray-800">Módulo CRUD – Encuestas</h1>
          </div>
          <NetworkStatus />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Barra de acciones */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-700">Encuestas registradas</h2>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Download size={15} /> Exportar CSV
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <PlusCircle size={16} />
              {showForm ? 'Cancelar' : 'Nueva Encuesta'}
            </button>
          </div>
        </div>

        {/* Formulario colapsable */}
        {showForm && (
          <PersonaForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Lista reactiva */}
        <PersonaList onSelect={setSelectedId} />
      </main>

      {/* Modal de detalle */}
      {selectedId && (
        <PersonaDetail
          personaId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
