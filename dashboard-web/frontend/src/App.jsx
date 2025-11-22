import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceholderPage from './pages/PlaceholderPages';

// Services
import { setAuthToken, getCurrentUser } from './services/api_service';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const token = localStorage.getItem('dashboardToken');
    if (token) {
      setAuthToken(token);
      loadCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      localStorage.removeItem('dashboardToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, user) => {
    localStorage.setItem('dashboardToken', token);
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboardToken');
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* New Routes */}
          {[
            { path: 'activity', title: 'Actividad' },
            { path: 'metrics', title: 'Métricas' },
            { path: 'analysis', title: 'Análisis' },
            { path: 'calls', title: 'Llamadas' },
            { path: 'providers', title: 'Proveedores' },
            { path: 'reports', title: 'Reportes' },
            { path: 'performance', title: 'Rendimiento' },
            { path: 'settings', title: 'Configuración' },
          ].map((route) => (
            <Route
              key={route.path}
              path={`/${route.path}`}
              element={
                isAuthenticated ? (
                  <DashboardPage
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    initialTab={route.path} // Pass the path to DashboardPage to render placeholder
                    placeholderTitle={route.title} // Pass the title for PlaceholderPage
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          ))}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;

