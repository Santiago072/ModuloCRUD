import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ClipboardList, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export function AppSidebar() {
  const { user, logout, isSidebarOpen, closeSidebar } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    closeSidebar();
    await logout();
    navigate('/login');
  };

  const navItems = user?.rol === 'admin' 
    ? [
        { to: '/admin', icon: <Users size={20} />, label: 'Gestión Usuarios' },
        { to: '/admin/encuestas', icon: <ClipboardList size={20} />, label: 'Gestión de Encuestas' }
      ]
    : [
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Mi Dashboard' }
      ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between text-blue-600 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ClipboardList size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">ModCRUD</h1>
          </div>
          {/* Botón cerrar en móvil */}
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200/50">
        <div className="mb-4 px-4 py-3 blue-gradient-subtle rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Fija para Escritorio (md+) */}
      <aside className="w-64 glass h-screen sticky top-0 flex flex-col hidden md:flex border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        {sidebarContent}
      </aside>

      {/* Drawer Móvil para Pantallas Pequeñas (< md) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop con desenfoque */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={closeSidebar} 
          />
          {/* Panel Lateral Deslizante */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
