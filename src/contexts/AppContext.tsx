
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<'admin' | 'empleado' | 'cliente' | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [tareasPendientes, setTareasPendientes] = useState<Tarea[]>([]);
  const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);

  useEffect(() => {
    // Inicializar la aplicación y cargar datos iniciales
    initializeApp();
    
    // Recuperar la sesión si existe
    const sessionInfo = localStorage.getItem('sessionInfo');
    if (sessionInfo) {
      const { isLogged, userRole, userData } = JSON.parse(sessionInfo);
      setIsLoggedIn(isLogged);
      setRole(userRole);
      setCurrentUser(userData);
    }
    
    refreshData();
  }, []);

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
    // En una aplicación real, esto debería validar contra una API
    // Por ahora, para fines de demostración, permitiremos el inicio de sesión con credenciales fijas
    
    if (email === 'admin@asesoria.es' && password === 'admin') {
      setIsLoggedIn(true);
      setRole('admin');
      
      const userData = {
        id: '1',
        nombre: 'Administrador',
        email: 'admin@asesoria.es'
      };
      
      setCurrentUser(userData);
      localStorage.setItem('sessionInfo', JSON.stringify({
        isLogged: true,
        userRole: 'admin',
        userData
      }));
      
      return true;
    }
    
    // Si añadimos usuarios de prueba en datos iniciales, podríamos validar contra ellos aquí
    
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('sessionInfo');
  };

  return (
    <AppContext.Provider
      value={{
        asesoria,
        isLoggedIn,
        role,
        currentUser,
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
