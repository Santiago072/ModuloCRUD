import { useState } from 'react';
import { PersonaForm } from '../features/personas/PersonaForm';
import { PersonaList } from '../features/personas/PersonaList';
import { NetworkStatus } from '../components/NetworkStatus';
import { useSyncManager } from '../hooks/useSyncManager';
import { PlusCircle, ClipboardList } from 'lucide-react';

/**
 * Página principal de la aplicación.
 * Orquesta el formulario de encuesta y la lista de personas registradas.
 * useSyncManager corre en el fondo sincronizando al recuperar red.
 */
export default function HomePage() {
  useSyncManager(); // 🔄 Activa la sincronización automática en segundo plano
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList size={22} className="text-indigo-600" />
            <h1 className="text-base font-bold text-gray-800">Módulo CRUD – Encuestas</h1>
          </div>
          <NetworkStatus />
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Botón para abrir/cerrar el formulario */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Encuestas registradas</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle size={16} />
            {showForm ? 'Cancelar' : 'Nueva Encuesta'}
          </button>
        </div>

        {/* Formulario expandible */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Datos de la persona encuestada</h3>
            <PersonaForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        {/* Lista reactiva */}
        <PersonaList />
      </main>
    </div>
  );
}
