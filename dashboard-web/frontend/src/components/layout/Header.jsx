import React from 'react';
import { Menu, RefreshCw, LogOut, User, Bell, Search, ChevronDown } from 'lucide-react';

function Header({ currentUser, onLogout, onToggleSidebar, onRefresh, refreshing }) {
  return (
    <header className="sticky top-0 z-sticky bg-canvas-header border-b border-border-DEFAULT shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="relative">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard B2B
                </h1>
                <p className="text-xs text-gray-500">Sistema de Licitaciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn btn-ghost flex items-center gap-2"
            title="Actualizar datos"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100">
              <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role || 'Rol'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* User dropdown menu - simplified for this implementation */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 hidden">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

