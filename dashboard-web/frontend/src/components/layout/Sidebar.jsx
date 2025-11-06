import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Phone, 
  Settings,
  FileText
} from 'lucide-react';

function Sidebar({ isOpen, currentUser }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Métricas', active: false },
    { icon: Phone, label: 'Llamadas', active: false },
    { icon: Users, label: 'Proveedores', active: false },
    { icon: FileText, label: 'Reportes', active: false },
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
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '16rem' }}
    >
      <nav className="h-full overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer del sidebar */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">Versión 1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 Capstone Grupo 5</p>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;

