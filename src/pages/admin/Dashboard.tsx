
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, Users, FileText, FileCheck, 
  Calendar, AlertTriangle, Clock, ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAll, Cliente, Tarea, Factura } from '../../utils/localStorage';

// Componente para el gráfico de barras simple
const SimpleBarChart = ({ data, color = "bg-primary" }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end h-20 space-x-1">
      {data.map((value, index) => (
        <div 
          key={index}
          className="flex-1 rounded-t"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: `hsl(var(--${color}))`,
            opacity: 0.2 + (0.8 * (value / max))
          }}
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { asesoria, refreshData } = useApp();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tareasPendientes, setTareasPendientes] = useState<Tarea[]>([]);
  const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);

  useEffect(() => {
    setClientes(getAll<Cliente>('clientes'));
    
    const allTareas = getAll<Tarea>('tareas');
    setTareasPendientes(
      allTareas
        .filter(t => t.estado !== 'completada')
        .sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime())
        .slice(0, 5)
    );
    
    const allFacturas = getAll<Factura>('facturas');
    setFacturasPendientes(
      allFacturas
        .filter(f => f.estadoPago !== 'pagada')
        .slice(0, 5)
    );
    
    refreshData();
  }, [refreshData]);

  // Datos de ejemplo para gráficos
  const facturationData = [14500, 19200, 16800, 24100, 22400, 25100];
  const clientsData = [10, 12, 15, 14, 16, 18];
  
  // Para calcular el número de tareas por estado
  const calcularTareasPorEstado = () => {
    const tareas = getAll<Tarea>('tareas');
    const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
    const enProgreso = tareas.filter(t => t.estado === 'en progreso').length;
    const completadas = tareas.filter(t => t.estado === 'completada').length;
    
    return { pendientes, enProgreso, completadas };
  };
  
  const tareasStats = calcularTareasPorEstado();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-gray-500">Bienvenido al panel de administración de {asesoria?.nombre}</p>
          </div>
          <div>
            <Button onClick={refreshData}>Actualizar datos</Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Clientes</p>
                <h3 className="text-3xl font-bold">{clientes.length}</h3>
                <p className="text-xs text-green-500 mt-1">+2 este mes</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tareas Pendientes</p>
                <h3 className="text-3xl font-bold">{tareasStats.pendientes + tareasStats.enProgreso}</h3>
                <p className="text-xs text-red-500 mt-1">5 urgentes</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Facturas Pendientes</p>
                <h3 className="text-3xl font-bold">{facturasPendientes.length}</h3>
                <p className="text-xs text-green-500 mt-1">3 pagos recibidos hoy</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Declaraciones</p>
                <h3 className="text-3xl font-bold">8</h3>
                <p className="text-xs text-amber-500 mt-1">2 pendientes</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Facturación</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={facturationData} color="primary" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Facturado</p>
                  <p className="text-2xl font-bold">122.100€</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Clientes</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={clientsData} color="secondary" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Nuevos clientes</p>
                  <p className="text-2xl font-bold">+8</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tasks & Activities */}
        <div>
          <Tabs defaultValue="tasks">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="tasks">Tareas Pendientes</TabsTrigger>
                <TabsTrigger value="invoices">Facturas Pendientes</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/tareas" className="flex items-center text-primary">
                  Ver todas <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <TabsContent value="tasks" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  {tareasPendientes.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No hay tareas pendientes</p>
                  ) : (
                    <ul className="divide-y">
                      {tareasPendientes.map((tarea) => (
                        <li key={tarea.id} className="py-3 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <Badge 
                                variant={tarea.prioridad === 'alta' || tarea.prioridad === 'urgente' ? 'destructive' : 'outline'}
                                className="mr-2"
                              >
                                {tarea.prioridad}
                              </Badge>
                              <span className="font-medium">{tarea.descripcion}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>Cliente: {tarea.clienteId}</span>
                              <span className="ml-3">Responsable: {tarea.responsable}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-4">
                              <p className="text-sm font-medium">{new Date(tarea.fechaLimite).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">{tarea.estado}</p>
                            </div>
                            {new Date(tarea.fechaLimite) < new Date() && (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoices" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  {facturasPendientes.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No hay facturas pendientes</p>
                  ) : (
                    <ul className="divide-y">
                      {facturasPendientes.map((factura) => (
                        <li key={factura.id} className="py-3 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <Badge 
                                variant={factura.estadoPago === 'pendiente' ? 'outline' : 'default'}
                                className="mr-2"
                              >
                                {factura.estadoPago}
                              </Badge>
                              <span className="font-medium">{factura.numero}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>Cliente: {factura.clienteId}</span>
                              <span className="ml-3">Fecha: {new Date(factura.fecha).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{factura.total.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}</p>
                            <p className="text-xs text-gray-500">{factura.metodoPago}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Quick Access */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to="/admin/clientes">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">Clientes</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/facturas">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">Facturas</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/calendario">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">Calendario</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/documentos">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <FileCheck className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">Documentos</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
