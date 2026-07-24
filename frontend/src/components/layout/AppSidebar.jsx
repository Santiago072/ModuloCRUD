import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Settings, ClipboardList } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = user?.rol === 'admin' 
    ? [
        { to: '/admin', icon: <Users size={20} />, label: 'Gestión Usuarios' }
      ]
    : [
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Mi Dashboard' }
      ];

  return (
    <aside className="w-64 glass h-screen sticky top-0 flex flex-col hidden md:flex border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 text-blue-600 mb-8">
          <div className="p-2 bg-blue-100 rounded-xl">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ModCRUD</h1>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
