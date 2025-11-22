import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Phone,
  Settings,
  FileText,
  TrendingUp,
  Activity,
  PieChart,
  Menu
} from 'lucide-react';

function Sidebar({ isOpen, currentUser }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Activity, label: 'Actividad', active: false },
    { icon: BarChart3, label: 'Métricas', active: false },
    { icon: PieChart, label: 'Análisis', active: false },
    { icon: Phone, label: 'Llamadas', active: false },
    { icon: Users, label: 'Proveedores', active: false },
    { icon: FileText, label: 'Reportes', active: false },
    { icon: TrendingUp, label: 'Rendimiento', active: false },
    { icon: Settings, label: 'Configuración', active: false, admin: true }
  ];

  // Filtrar items según el rol
  const filteredItems = menuItems.filter(item => {
    if (item.admin && currentUser?.role !== 'Admin') {
      return false;
    }
    return true;
  });

  return (
    <aside className={`fixed inset-y-0 left-0 z-dropdown w-64 bg-canvas-sidebar text-ink-inverse transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.name || 'Usuario'}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {currentUser?.role || 'Rol'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

