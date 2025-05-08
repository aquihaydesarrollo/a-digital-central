
import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Tarea, 
  Factura, 
  Documento, 
  getAll 
} from '../../utils/localStorage';
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Receipt, 
  CheckSquare
} from 'lucide-react';

const Calendario = () => {
  const { refreshData } = useApp();
  const [date, setDate] = useState<Date>(new Date());
  const [eventos, setEventos] = useState<Array<any>>([]);
  const [eventosDia, setEventosDia] = useState<Array<any>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    cargarEventos();
  }, []);
  
  const cargarEventos = () => {
    // Cargar tareas
    const tareas = getAll<Tarea>('tareas').map(tarea => ({
      ...tarea,
      tipo: 'tarea',
      fecha: tarea.fechaLimite,
      titulo: tarea.descripcion,
      detalle: `Responsable: ${tarea.responsable} | Prioridad: ${tarea.prioridad}`,
      color: getColorPrioridad(tarea.prioridad)
    }));
    
    // Cargar facturas
    const facturas = getAll<Factura>('facturas').map(factura => ({
      ...factura,
      tipo: 'factura',
      fecha: factura.fecha,
      titulo: `Factura ${factura.numero}`,
      detalle: `${factura.concepto} - ${factura.total.toFixed(2)}€`,
      color: factura.tipo === 'emitida' ? 'bg-green-100' : 'bg-blue-100'
    }));
    
    // Cargar documentos
    const documentos = getAll<Documento>('documentos').map(documento => ({
      ...documento,
      tipo: 'documento',
      fecha: documento.fechaSubida,
      titulo: documento.descripcion,
      detalle: `Tipo: ${documento.tipo}`,
      color: 'bg-yellow-100'
    }));
    
    // Combinar todos los eventos
    const todosEventos = [...tareas, ...facturas, ...documentos];
    setEventos(todosEventos);
  };
  
  useEffect(() => {
    // Filtrar eventos del día seleccionado
    const eventosFiltrados = eventos.filter(evento => 
      isSameDay(new Date(evento.fecha), date)
    );
    
    setEventosDia(eventosFiltrados);
    
    if (eventosFiltrados.length > 0 && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [date, eventos]);
  
  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'bg-green-100';
      case 'media': return 'bg-yellow-100';
      case 'alta': return 'bg-orange-100';
      case 'urgente': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };
  
  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'tarea': return <CheckSquare className="h-4 w-4" />;
      case 'factura': return <Receipt className="h-4 w-4" />;
      case 'documento': return <FileText className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  // Función para verificar si una fecha tiene eventos
  const fechaTieneEvento = (date: Date) => {
    return eventos.some(evento => isSameDay(new Date(evento.fecha), date));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Calendario</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  locale={es}
                  className="rounded-md border"
                  modifiers={{
                    eventDay: (date) => fechaTieneEvento(date),
                  }}
                  modifiersStyles={{
                    eventDay: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "var(--primary)",
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Eventos para {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="todos">
                  <TabsList className="mb-4">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="tareas">Tareas</TabsTrigger>
                    <TabsTrigger value="facturas">Facturas</TabsTrigger>
                    <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="todos">
                    {eventosDia.length === 0 ? (
                      <p className="text-center py-4">No hay eventos para este día</p>
                    ) : (
                      <div className="space-y-2">
                        {eventosDia.map((evento) => (
                          <div 
                            key={evento.id} 
                            className={`p-3 rounded-lg border ${evento.color}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getIconoTipo(evento.tipo)}
                                <span className="ml-2 font-medium">{evento.titulo}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{evento.detalle}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="tareas">
                    {eventosDia.filter(e => e.tipo === 'tarea').length === 0 ? (
                      <p className="text-center py-4">No hay tareas para este día</p>
                    ) : (
                      <div className="space-y-2">
                        {eventosDia
                          .filter(e => e.tipo === 'tarea')
                          .map((tarea) => (
                            <div 
                              key={tarea.id} 
                              className={`p-3 rounded-lg border ${tarea.color}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CheckSquare className="h-4 w-4" />
                                  <span className="ml-2 font-medium">{tarea.titulo}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  tarea.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                                  tarea.estado === 'en progreso' ? 'bg-blue-200 text-blue-800' :
                                  'bg-green-200 text-green-800'
                                }`}>
                                  {tarea.estado === 'pendiente' ? 'Pendiente' : 
                                   tarea.estado === 'en progreso' ? 'En Progreso' : 'Completada'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{tarea.detalle}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="facturas">
                    {eventosDia.filter(e => e.tipo === 'factura').length === 0 ? (
                      <p className="text-center py-4">No hay facturas para este día</p>
                    ) : (
                      <div className="space-y-2">
                        {eventosDia
                          .filter(e => e.tipo === 'factura')
                          .map((factura) => (
                            <div 
                              key={factura.id} 
                              className={`p-3 rounded-lg border ${factura.color}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Receipt className="h-4 w-4" />
                                  <span className="ml-2 font-medium">{factura.titulo}</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                                  {factura.estadoPago}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{factura.detalle}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documentos">
                    {eventosDia.filter(e => e.tipo === 'documento').length === 0 ? (
                      <p className="text-center py-4">No hay documentos para este día</p>
                    ) : (
                      <div className="space-y-2">
                        {eventosDia
                          .filter(e => e.tipo === 'documento')
                          .map((documento) => (
                            <div 
                              key={documento.id} 
                              className={`p-3 rounded-lg border ${documento.color}`}
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4" />
                                <span className="ml-2 font-medium">{documento.titulo}</span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{documento.detalle}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Eventos para {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </DialogTitle>
            <DialogDescription>
              Resumen de eventos programados para esta fecha.
            </DialogDescription>
          </DialogHeader>

          {eventosDia.length === 0 ? (
            <p className="text-center py-4">No hay eventos programados para este día</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {eventosDia.map((evento) => (
                <div 
                  key={evento.id} 
                  className={`p-3 rounded-lg border ${evento.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getIconoTipo(evento.tipo)}
                      <span className="ml-2 font-medium">{evento.titulo}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{evento.detalle}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Calendario;
