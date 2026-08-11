import { useState } from 'react';
import { PersonaForm } from '../features/personas/PersonaForm';
import { PersonaList } from '../features/personas/PersonaList';
import { PersonaDetail } from '../features/personas/PersonaDetail';
import { NetworkStatus } from '../components/ui/NetworkStatus';
import { useSyncManager } from '../hooks/useSyncManager';
import { exportToCSV } from '../utils/exportUtils';
import { AppSidebar } from '../components/layout/AppSidebar';
import { Plus, X, Download, LayoutDashboard, Menu } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  useSyncManager();
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user, toggleSidebar } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header Mobile & Network */}
        <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Abrir menú de navegación"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 md:hidden truncate">ModCRUD</h2>
            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <LayoutDashboard size={18} />
              <span className="font-medium">Hola, {user?.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NetworkStatus />
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-6">
          
          {/* Header Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mis Encuestas</h1>
              <p className="text-sm text-slate-500 mt-1">Gestiona los registros que has recolectado en campo.</p>
            </div>
            <div className="flex flex-wrap gap-3">
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

          {/* Formulario Animado */}
          <div className={`transition-all duration-300 ease-in-out origin-top ${showForm ? 'opacity-100 scale-y-100 max-h-[2000px]' : 'opacity-0 scale-y-95 max-h-0 overflow-hidden'}`}>
            <div className="glass-panel p-6">
              <PersonaForm
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>

          {/* Lista */}
          <div className="glass-panel p-6">
            <PersonaList onSelect={setSelectedId} />
          </div>
        </main>
      </div>

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
