import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

const API_URL = '/api';

export default function AdminDashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [encuestadores, setEncuestadores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEncuestadores = async () => {
    try {
      const res = await fetch(`${API_URL}/encuestadores`);
      const data = await res.json();
      if (data.status === 'success') {
        setEncuestadores(data.data);
      }
    } catch (error) {
      console.error('Error fetching encuestadores', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncuestadores();
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
    <div className="min-h-screen bg-gray-100 relative">
      <nav className="bg-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Panel Admin - Módulo CRUD</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Hola, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium leading-6 text-gray-900">Gestión de Encuestadores</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
              >
                <Plus size={16} /> Nuevo Encuestador
              </button>
            </div>
            
            {/* Modal de creación */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Añadir Encuestador</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                          <X size={20} />
                        </button>
                      </div>
                      <form onSubmit={handleCreate}>
                        <div className="mt-2">
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                          <input
                            type="text"
                            id="nombre"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            placeholder="Ej. María López"
                            className="mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            autoFocus
                          />
                        </div>
                        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Cancelar
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
              <p className="text-center text-gray-500">Cargando...</p>
            ) : (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {encuestadores.map((encuestador) => (
                            <tr key={encuestador.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {encuestador.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${encuestador.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {encuestador.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleToggleActivo(encuestador.id, encuestador.activo, encuestador.nombre)}
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  {encuestador.activo ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                  onClick={() => handleDelete(encuestador.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {encuestadores.length === 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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
