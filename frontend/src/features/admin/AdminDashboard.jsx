import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Users, FileText, Trophy, LogOut, KeyRound } from 'lucide-react';

const API_URL = '/api';

export default function AdminDashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [encuestadores, setEncuestadores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [stats, setStats] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword || !newPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPasswordSuccess('¡Contraseña actualizada con éxito!');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setPasswordSuccess('');
        }, 1500);
      } else {
        setPasswordError(data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setPasswordError('Error de conexión');
    }
  };

  const fetchEncuestadores = async () => {
    try {
      const res = await fetch(`${API_URL}/encuestadores`);
      const data = await res.json();
      if (data.status === 'success') {
        setEncuestadores(data.data);
      }
    } catch (error) {
      console.error('Error fetching encuestadores', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncuestadores();
    fetchStats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    try {
      const res = await fetch(`${API_URL}/encuestadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevoNombre })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNuevoNombre('');
        setIsModalOpen(false);
        fetchEncuestadores();
      }
    } catch (error) {
      console.error('Error creating encuestador', error);
    }
  };

  const handleToggleActivo = async (id, currentStatus, nombre) => {
    try {
      await fetch(`${API_URL}/encuestadores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, activo: !currentStatus })
      });
      fetchEncuestadores();
    } catch (error) {
      console.error('Error updating encuestador', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este encuestador?')) return;
    try {
      await fetch(`${API_URL}/encuestadores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchEncuestadores();
    } catch (error) {
      console.error('Error deleting encuestador', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="text-white h-5 w-5" />
              </div>
              <h1 className="text-slate-800 text-xl font-bold tracking-tight">Panel Admin</h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-slate-600 text-sm font-medium">{user?.username}</span>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                title="Cambiar Contraseña"
              >
                <KeyRound size={18} />
                <span className="hidden sm:inline">Contraseña</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Tarjetas de Estadísticas Mejoradas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <Users className="text-blue-500 mb-3" size={32} />
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Personas</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-1">{stats.totalPersonas}</span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 bg-indigo-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <FileText className="text-indigo-500 mb-3" size={32} />
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Encuestas</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-1">{stats.totalEncuestas}</span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Trophy className="text-amber-500" size={20} />
                  <span className="text-slate-700 text-sm font-bold uppercase tracking-wide">Top Encuestadores</span>
                </div>
                <ul className="space-y-3">
                  {stats.ranking.length > 0 ? stats.ranking.map((r, i) => (
                    <li key={i} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg">
                      <span className="text-slate-700 font-medium truncate mr-2 flex items-center gap-2" title={r.encuestador}>
                        <span className="text-slate-400 font-bold w-4">{i+1}.</span>
                        {r.encuestador || 'Desconocido'}
                      </span>
                      <span className="font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">{r.cantidad}</span>
                    </li>
                  )) : (
                    <li className="text-slate-400 text-sm text-center py-4">Sin datos</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Gestión de Encuestadores</h2>
                <p className="text-sm text-slate-500 mt-1">Añade o deshabilita los encuestadores que aparecen en la app.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 justify-center py-2.5 px-5 shadow-sm text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
              >
                <Plus size={18} /> Nuevo Encuestador
              </button>
            </div>
            
            {/* Modal de creación */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-slate-900 opacity-50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white px-6 pt-6 pb-6">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-bold text-slate-800">Añadir Encuestador</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                      <form onSubmit={handleCreate}>
                        <div className="mt-2">
                          <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                          <input
                            type="text"
                            id="nombre"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            placeholder="Ej. María López"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-slate-300 px-5 py-2.5 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-5 py-2.5 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            Guardar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Cambio de Contraseña */}
            {isPasswordModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-slate-900 opacity-50 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                    <div className="bg-white px-6 pt-6 pb-6">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-bold text-slate-800">Cambiar Contraseña</h3>
                        <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                      
                      {passwordError && (
                        <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                          <p className="text-sm font-medium text-red-800">{passwordError}</p>
                        </div>
                      )}
                      
                      {passwordSuccess && (
                        <div className="mb-5 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
                          <p className="text-sm font-medium text-green-800">{passwordSuccess}</p>
                        </div>
                      )}

                      <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Actual</label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-slate-300 px-5 py-2.5 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent px-5 py-2.5 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            Actualizar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-slate-200 sm:rounded-xl">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {encuestadores.map((encuestador) => (
                            <tr key={encuestador.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                {encuestador.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md ${encuestador.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {encuestador.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                  onClick={() => handleToggleActivo(encuestador.id, encuestador.activo, encuestador.nombre)}
                                  className={`${encuestador.activo ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'} transition-colors font-semibold`}
                                >
                                  {encuestador.activo ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                  onClick={() => handleDelete(encuestador.id)}
                                  className="text-rose-600 hover:text-rose-800 transition-colors font-semibold"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {encuestadores.length === 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-500 font-medium">
                                No hay encuestadores registrados.
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
        </div>
      </main>
    </div>
  );
}
