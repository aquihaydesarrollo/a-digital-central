
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'empleado' | 'cliente';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoggedIn, role } = useApp();

  // Si el usuario no está autenticado, redirigir a /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir a /login
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
