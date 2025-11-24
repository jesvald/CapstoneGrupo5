import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          <Home className="w-4 h-4" />
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;

