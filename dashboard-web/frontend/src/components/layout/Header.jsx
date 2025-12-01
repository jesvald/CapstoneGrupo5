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

        </div>
      </div>
    </header>
  );
}

export default Header;

