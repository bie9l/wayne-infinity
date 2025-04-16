import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  return isAuthenticated ? children : <Navigate to="/login" />;
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