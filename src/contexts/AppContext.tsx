
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { initializeApp, getAll, getAsesoria, Asesoria, Cliente, Empleado, Tarea, Factura } from '../utils/localStorage';

interface AppContextType {
  asesoria: Asesoria | null;
  isLoggedIn: boolean;
  role: 'admin' | 'empleado' | 'cliente' | null;
  currentUser: any | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clientes: Cliente[];
  empleados: Empleado[];
  tareasPendientes: Tarea[];
  facturasPendientes: Factura[];
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [asesoria, setAsesoria] = useState<Asesoria | null>(null);
  const [role, setRole] = useState<'admin' | 'empleado' | 'cliente' | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [tareasPendientes, setTareasPendientes] = useState<Tarea[]>([]);
  const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);

  // Use Clerk for authentication
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Consider user logged in if Clerk has authenticated them
  const isLoggedIn = !!isSignedIn;

  useEffect(() => {
    // Inicializar la aplicación y cargar datos iniciales
    initializeApp();
    
    // If user is signed in, set role based on email
    if (isSignedIn && user) {
      // Typically you'd get role from Clerk's user metadata or custom API
      // For demo purposes, we'll set admin role based on email
      if (user.primaryEmailAddress?.emailAddress === 'admin@asesoria.es') {
        setRole('admin');
      } else {
        // Default role for other users
        setRole('cliente');
      }
    }
    
    refreshData();
  }, [isSignedIn, user]);

  const refreshData = () => {
    // Cargar datos de la asesoria
    setAsesoria(getAsesoria());
    
    // Cargar listas de entidades
    setClientes(getAll('clientes'));
    setEmpleados(getAll('empleados'));
    
    // Cargar tareas pendientes
    const allTareas = getAll<Tarea>('tareas');
    setTareasPendientes(allTareas.filter(t => t.estado !== 'completada').sort(
      (a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()
    ));
    
    // Cargar facturas pendientes de pago
    const allFacturas = getAll<Factura>('facturas');
    setFacturasPendientes(allFacturas.filter(f => f.estadoPago !== 'pagada'));
  };

  const login = (email: string, password: string) => {
    // This function is kept for backwards compatibility
    // But authentication is now handled by Clerk
    return isSignedIn;
  };

  const logout = () => {
    setRole(null);
    // Use Clerk's signOut method
    signOut();
  };

  return (
    <AppContext.Provider
      value={{
        asesoria,
        isLoggedIn,
        role,
        currentUser: user,
        login,
        logout,
        clientes,
        empleados,
        tareasPendientes,
        facturasPendientes,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
