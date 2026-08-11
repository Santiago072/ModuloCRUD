import { useState } from 'react';
import { AppSidebar } from '../../components/layout/AppSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { PersonaList } from '../personas/PersonaList';
import { PersonaDetail } from '../personas/PersonaDetail';
import { PersonaForm } from '../personas/PersonaForm';
import { useSyncManager } from '../../hooks/useSyncManager';
import { exportToCSV } from '../../utils/exportUtils';
import { Download, Plus, X, ClipboardList } from 'lucide-react';

export default function AdminEncuestas() {
  useSyncManager(); // Sync offline data so PersonaList works for admin
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminHeader />

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
          
          {/* Cabecera y Acciones para el Administrador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <ClipboardList size={22} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Gestión de Encuestas</h1>
              </div>
              <p className="text-sm text-slate-500">
                Consulta, registra, edita o exporta las encuestas de todo el sistema.
              </p>
            </div>

            {/* Botones de Acción (Exportar CSV y Crear Encuesta) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
              >
                <Download size={16} className="text-slate-500" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={() => setShowForm(!showForm)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 ${
                  showForm
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-rose-500/10'
                    : 'blue-gradient hover:opacity-90 text-white shadow-blue-500/20'
                }`}
              >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                <span>{showForm ? 'Cancelar' : 'Nueva Encuesta'}</span>
              </button>
            </div>
          </div>

          {/* Formulario de Registro de Encuesta para el Administrador */}
          {showForm && (
            <div className="glass-panel p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-800">Registrar Nueva Encuesta (Administrador)</h3>
                <p className="text-xs text-slate-500">Los datos ingresados se asociarán a tu cuenta de administrador y se sincronizarán automáticamente.</p>
              </div>
              <PersonaForm
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Listado de Encuestas con Búsqueda y Edición */}
          <div className="glass-panel p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Registros del Censo</h3>
                <p className="text-xs text-slate-500">Haz clic en cualquier persona para ver detalles, historial de rotación de contactos o editar.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <PersonaList isAdmin={true} onSelect={setSelectedId} />
            </div>
          </div>

        </main>
      </div>

      {/* Modal de Detalle y Edición */}
      {selectedId && (
        <PersonaDetail
          personaId={selectedId}
          onClose={() => setSelectedId(null)}
          isAdmin={true}
        />
      )}
    </div>
  );
}
