import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Users, FileText, Trophy, KeyRound, Loader2, LayoutDashboard } from 'lucide-react';
import { AppSidebar } from '../../components/layout/AppSidebar';

const API_URL = '/api';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsername, setNuevoUsername] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [stats, setStats] = useState(null);

  // Edit User State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsuarios(data.data);
      }
    } catch (error) {
      console.error('Error fetching usuarios', error);
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
    fetchUsuarios();
    fetchStats();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!nuevoUsername.trim() || !nuevaPassword.trim()) return;

    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: nuevoUsername, password: nuevaPassword })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNuevoUsername('');
        setNuevaPassword('');
        setIsModalOpen(false);
        fetchUsuarios();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating usuario', error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editUsername.trim()) return;

    try {
      const res = await fetch(`${API_URL}/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: editUsername, password: editPassword })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsEditModalOpen(false);
        fetchUsuarios();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error editing usuario', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? No podrá acceder al sistema.')) return;
    try {
      await fetch(`${API_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsuarios();
    } catch (error) {
      console.error('Error deleting usuario', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Las contraseñas no coinciden');
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
          setConfirmNewPassword('');
          setPasswordSuccess('');
        }, 1500);
      } else {
        setPasswordError(data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setPasswordError('Error de conexión');
    }
  };

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <KeyRound size={18} />
              <span className="hidden sm:inline">Mi Contraseña</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
          
          {/* Tarjetas de Estadísticas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <Users className="text-blue-500 mb-3" size={32} />
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Personas</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-1">{stats.totalPersonas}</span>
              </div>

              <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 bg-indigo-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <FileText className="text-indigo-500 mb-3" size={32} />
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Encuestas</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-1">{stats.totalEncuestas}</span>
              </div>

              <div className="glass-panel p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Trophy className="text-amber-500" size={20} />
                  <span className="text-slate-700 text-sm font-bold uppercase tracking-wide">Top Encuestadores</span>
                </div>
                <ul className="space-y-3">
                  {stats.ranking.length > 0 ? stats.ranking.map((r, i) => (
                    <li key={i} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg">
                      <span className="text-slate-700 font-medium truncate mr-2 flex items-center gap-2">
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

          {/* Gestión de Usuarios */}
          <div className="glass-panel p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h2>
                <p className="text-sm text-slate-500 mt-1">Crea cuentas para que los encuestadores ingresen al sistema.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 justify-center py-2.5 px-5 shadow-md text-sm font-semibold rounded-xl text-white blue-gradient hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
              >
                <Plus size={18} /> Nuevo Usuario
              </button>
            </div>
            


            {/* Tabla Usuarios */}
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
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario (Login)</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {usuarios.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                {u.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                  Encuestador
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                  onClick={() => {
                                    setEditingUser(u);
                                    setEditUsername(u.username);
                                    setEditPassword('');
                                    setIsEditModalOpen(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  className="text-rose-600 hover:text-rose-800 transition-colors font-semibold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg"
                                >
                                  Eliminar Cuenta
                                </button>
                              </td>
                            </tr>
                          ))}
                          {usuarios.length === 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-500 font-medium">
                                No hay usuarios encuestadores registrados.
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

      {/* Modal Crear Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="px-6 pt-6 pb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-slate-800">Crear Usuario</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre de Usuario</label>
                    <input
                      type="text"
                      required
                      value={nuevoUsername}
                      onChange={(e) => setNuevoUsername(e.target.value)}
                      placeholder="Ej. maria.lopez"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                    <input
                      type="password"
                      required
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-200 px-5 py-2.5 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold text-white blue-gradient shadow-md hover:opacity-90 transition-all"
                    >
                      Crear Cuenta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsEditModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="px-6 pt-6 pb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-slate-800">Editar Usuario</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleEditUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre de Usuario</label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nueva Contraseña <span className="text-slate-400 font-normal">(Opcional)</span></label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-200 px-5 py-2.5 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold text-white blue-gradient shadow-md hover:opacity-90 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsPasswordModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="px-6 pt-6 pb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-slate-800">Cambiar Contraseña</h3>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200">
                    <X size={18} />
                  </button>
                </div>
                
                {passwordError && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm">{passwordError}</div>}
                {passwordSuccess && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg text-sm">{passwordSuccess}</div>}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña Actual</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repetir Nueva Contraseña</label>
                    <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div className="mt-6 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 rounded-xl border bg-slate-50 text-sm font-semibold">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl blue-gradient text-white text-sm font-semibold">Actualizar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
