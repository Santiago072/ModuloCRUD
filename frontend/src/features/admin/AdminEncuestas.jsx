import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Loader2, LayoutDashboard } from 'lucide-react';
import { AppSidebar } from '../../components/layout/AppSidebar';

const API_URL = '/api';

export default function AdminEncuestas() {
  const { token } = useAuthStore();
  const [todasEncuestas, setTodasEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodasEncuestas = async () => {
      try {
        const res = await fetch(`${API_URL}/stats/encuestas`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setTodasEncuestas(data.data);
        }
      } catch (error) {
        console.error('Error fetching todas encuestas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodasEncuestas();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 md:hidden">ModCRUD Admin</h2>
            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <LayoutDashboard size={18} />
              <span className="font-medium">Panel Administrativo</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
          {/* Todas las Encuestas */}
          <div className="glass-panel p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Todas las Encuestas</h2>
              <p className="text-sm text-slate-500 mt-1">Listado general de todos los registros en el sistema.</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-slate-200 rounded-xl">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50/80 backdrop-blur-sm">
                          <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ciudadano</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">CC</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Encuestador</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {todasEncuestas.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                {e.nombres} {e.apellidos}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {e.cc}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {e.contacto || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {e.encuestador || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {e.fecha_registro}
                              </td>
                            </tr>
                          ))}
                          {todasEncuestas.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500 font-medium">
                                No hay encuestas registradas aún.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
