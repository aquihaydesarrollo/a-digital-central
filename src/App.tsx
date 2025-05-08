
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { useEffect } from "react";
import { initializeApp } from "./utils/localStorage";

// Páginas públicas
import Index from "./pages/Index";
import QuienesSomos from "./pages/QuienesSomos";
import Servicios from "./pages/Servicios";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Páginas de administración
import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Empleados from "./pages/admin/Empleados";
import Facturas from "./pages/admin/Facturas";
import Documentos from "./pages/admin/Documentos";
import Tareas from "./pages/admin/Tareas";
import Calendario from "./pages/admin/Calendario";
import Configuracion from "./pages/admin/Configuracion";

// Protección de rutas
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inicializar datos de la aplicación
    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/quienes-somos" element={<QuienesSomos />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />

              {/* Rutas de administración protegidas */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/clientes" element={
                <ProtectedRoute>
                  <Clientes />
                </ProtectedRoute>
              } />
              <Route path="/admin/empleados" element={
                <ProtectedRoute>
                  <Empleados />
                </ProtectedRoute>
              } />
              <Route path="/admin/facturas" element={
                <ProtectedRoute>
                  <Facturas />
                </ProtectedRoute>
              } />
              <Route path="/admin/documentos" element={
                <ProtectedRoute>
                  <Documentos />
                </ProtectedRoute>
              } />
              <Route path="/admin/tareas" element={
                <ProtectedRoute>
                  <Tareas />
                </ProtectedRoute>
              } />
              <Route path="/admin/calendario" element={
                <ProtectedRoute>
                  <Calendario />
                </ProtectedRoute>
              } />
              <Route path="/admin/configuracion" element={
                <ProtectedRoute>
                  <Configuracion />
                </ProtectedRoute>
              } />

              {/* Redireccion de /admin/* a /admin si no hay ruta específica */}
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

              {/* Ruta 404 - Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
