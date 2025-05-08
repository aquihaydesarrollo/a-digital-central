
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'empleado' | 'cliente';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { role } = useApp();

  return (
    <SignedIn>
      {/* If the user is signed in but doesn't have the required role, redirect to login */}
      {requiredRole && role !== requiredRole ? (
        <Navigate to="/login" replace />
      ) : (
        // If the user is signed in and has the required role, render the children
        <>{children}</>
      )}
    </SignedIn>
  );
};

export default ProtectedRoute;
