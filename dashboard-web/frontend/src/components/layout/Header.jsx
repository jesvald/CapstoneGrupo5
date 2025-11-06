import React from 'react';
import { Menu, RefreshCw, LogOut, User } from 'lucide-react';

function Header({ currentUser, onLogout, onToggleSidebar, onRefresh, refreshing }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Dashboard B2B
                </h1>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Botón de actualizar */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="btn btn-outline"
              title="Actualizar datos"
            >
              <RefreshCw 
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </span>
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role || 'Rol'}
                </p>
              </div>
              
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="btn btn-outline text-red-600 hover:bg-red-50"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

