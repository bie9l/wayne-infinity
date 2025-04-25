import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Páginas
import Dashboard from '../pages/Dashboard';
import Security from '../pages/Security';
import Vehicles from '../pages/Vehicles';
import Equipment from '../pages/Equipment';
import Devices from '../pages/Devices';
import Profile from '../pages/Profile';
import Login from '../pages/Login';

// Componente de proteção de rota
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Se não estiver autenticado e não estiver na página de login, redireciona para login
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado e tentar acessar a página de login, redireciona para home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/security"
        element={
          <PrivateRoute>
            <Security />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <PrivateRoute>
            <Vehicles />
          </PrivateRoute>
        }
      />
      <Route
        path="/equipment"
        element={
          <PrivateRoute>
            <Equipment />
          </PrivateRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <PrivateRoute>
            <Devices />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes; 