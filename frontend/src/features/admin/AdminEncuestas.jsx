import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { LayoutDashboard } from 'lucide-react';
import { AppSidebar } from '../../components/layout/AppSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { PersonaList } from '../personas/PersonaList';
import { PersonaDetail } from '../personas/PersonaDetail';
import { useSyncManager } from '../../hooks/useSyncManager';

export default function AdminEncuestas() {
  useSyncManager(); // Sync offline data so PersonaList works for admin
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminHeader />

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
          <div className="glass-panel p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Todas las Encuestas</h2>
              <p className="text-sm text-slate-500 mt-1">Listado general de todos los registros en el sistema (Puedes buscar y editar).</p>
            </div>
            
            <div className="mt-4">
              <PersonaList isAdmin={true} onSelect={setSelectedId} />
            </div>
          </div>
        </main>
      </div>

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
