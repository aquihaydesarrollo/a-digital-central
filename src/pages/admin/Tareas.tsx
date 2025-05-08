
import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tarea, Cliente, save, remove, getAll } from '../../utils/localStorage';
import { 
  Plus, 
  Pencil, 
  Trash, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar
} from 'lucide-react';

// Esquema de validación para el formulario de tarea
const tareaSchema = z.object({
  clienteId: z.string().min(1, {
    message: 'Debe seleccionar un cliente.',
  }),
  descripcion: z.string().min(1, {
    message: 'La descripción es requerida.',
  }),
  responsable: z.string().min(1, {
    message: 'El responsable es requerido.',
  }),
  fechaLimite: z.string().min(1, {
    message: 'La fecha límite es requerida.',
  }),
  estado: z.enum(['pendiente', 'en progreso', 'completada'], {
    required_error: 'Debe seleccionar un estado.',
  }),
  tipoTarea: z.string().min(1, {
    message: 'El tipo de tarea es requerido.',
  }),
  prioridad: z.enum(['baja', 'media', 'alta', 'urgente'], {
    required_error: 'Debe seleccionar una prioridad.',
  }),
  fechaRecordatorio: z.string().min(1, {
    message: 'La fecha de recordatorio es requerida.',
  }),
});

const tiposTarea = [
  'Contabilidad',
  'Fiscal',
  'Laboral',
  'Administrativo',
  'Legal',
  'Financiero',
  'Otros'
];

const Tareas = () => {
  const { refreshData } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTarea, setCurrentTarea] = useState<Tarea | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [activeTab, setActiveTab] = useState('todas');
  
  useEffect(() => {
    // Cargar tareas y clientes al montar el componente
    setTareas(getAll<Tarea>('tareas'));
    setClientes(getAll<Cliente>('clientes'));
  }, []);

  const form = useForm<z.infer<typeof tareaSchema>>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      clienteId: '',
      descripcion: '',
      responsable: '',
      fechaLimite: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      tipoTarea: '',
      prioridad: 'media',
      fechaRecordatorio: new Date().toISOString().split('T')[0],
    },
  });

  const handleEdit = (tarea: Tarea) => {
    setCurrentTarea(tarea);
    form.reset({
      clienteId: tarea.clienteId,
      descripcion: tarea.descripcion,
      responsable: tarea.responsable,
      fechaLimite: new Date(tarea.fechaLimite).toISOString().split('T')[0],
      estado: tarea.estado as 'pendiente' | 'en progreso' | 'completada',
      tipoTarea: tarea.tipoTarea,
      prioridad: tarea.prioridad,
      fechaRecordatorio: new Date(tarea.fechaRecordatorio).toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarea?')) {
      remove('tareas', id);
      setTareas(getAll<Tarea>('tareas'));
      refreshData();
      toast.success('Tarea eliminada correctamente');
    }
  };

  const handleCompleteTask = (tarea: Tarea) => {
    const updatedTarea = { ...tarea, estado: 'completada' };
    save('tareas', updatedTarea);
    setTareas(getAll<Tarea>('tareas'));
    refreshData();
    toast.success('¡Tarea completada!');
  };

  const handleInProgressTask = (tarea: Tarea) => {
    const updatedTarea = { ...tarea, estado: 'en progreso' };
    save('tareas', updatedTarea);
    setTareas(getAll<Tarea>('tareas'));
    refreshData();
    toast.success('Tarea marcada como en progreso');
  };

  const onSubmit = (values: z.infer<typeof tareaSchema>) => {
    const tareaData: Tarea = {
      id: currentTarea?.id || crypto.randomUUID(),
      clienteId: values.clienteId,
      descripcion: values.descripcion,
      responsable: values.responsable,
      fechaLimite: new Date(values.fechaLimite),
      estado: values.estado,
      tipoTarea: values.tipoTarea,
      prioridad: values.prioridad as 'baja' | 'media' | 'alta' | 'urgente',
      fechaRecordatorio: new Date(values.fechaRecordatorio),
    };

    save('tareas', tareaData);
    setTareas(getAll<Tarea>('tareas'));
    refreshData();
    setIsDialogOpen(false);
    toast.success(currentTarea ? 'Tarea actualizada correctamente' : 'Tarea agregada correctamente');
    form.reset();
    setCurrentTarea(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setCurrentTarea(null);
    }
  };

  const handleAddNew = () => {
    form.reset({
      clienteId: '',
      descripcion: '',
      responsable: '',
      fechaLimite: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      tipoTarea: '',
      prioridad: 'media',
      fechaRecordatorio: new Date().toISOString().split('T')[0],
    });
    setCurrentTarea(null);
    setIsDialogOpen(true);
  };

  const getClienteNombre = (clienteId: string): string => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  // Filtrar tareas según la pestaña activa
  const filteredTareas = tareas.filter(tarea => {
    if (activeTab === 'pendientes') return tarea.estado === 'pendiente';
    if (activeTab === 'progreso') return tarea.estado === 'en progreso';
    if (activeTab === 'completadas') return tarea.estado === 'completada';
    if (activeTab === 'urgentes') return tarea.prioridad === 'urgente';
    if (activeTab === 'hoy') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tareaDate = new Date(tarea.fechaLimite);
      tareaDate.setHours(0, 0, 0, 0);
      return tareaDate.getTime() === today.getTime();
    }
    return true; // Todas
  });

  // Ordenar tareas por fecha límite y prioridad
  const sortedTareas = [...filteredTareas].sort((a, b) => {
    // Primero ordenar por prioridad
    const prioridadOrder = { 'urgente': 0, 'alta': 1, 'media': 2, 'baja': 3 };
    const prioridadDiff = prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
    
    if (prioridadDiff !== 0) return prioridadDiff;
    
    // Si la prioridad es la misma, ordenar por fecha límite
    return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
  });

  // Obtener el color de la tarjeta según el estado y prioridad
  const getCardColorClass = (tarea: Tarea) => {
    if (tarea.estado === 'completada') return 'border-green-200 bg-green-50';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fechaLimite = new Date(tarea.fechaLimite);
    fechaLimite.setHours(0, 0, 0, 0);
    
    if (tarea.prioridad === 'urgente') return 'border-red-200 bg-red-50';
    if (tarea.prioridad === 'alta') return 'border-orange-200 bg-orange-50';
    if (isBefore(fechaLimite, today)) return 'border-red-200 bg-red-50';
    
    return 'border-blue-200 bg-blue-50';
  };

  // Obtener el icono de estado
  const getStatusIcon = (tarea: Tarea) => {
    if (tarea.estado === 'completada') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (tarea.estado === 'en progreso') return <Clock className="h-5 w-5 text-blue-600" />;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fechaLimite = new Date(tarea.fechaLimite);
    fechaLimite.setHours(0, 0, 0, 0);
    
    if (isBefore(fechaLimite, today)) return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <Calendar className="h-5 w-5 text-gray-600" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
          </Button>
        </div>

        <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="progreso">En Progreso</TabsTrigger>
            <TabsTrigger value="completadas">Completadas</TabsTrigger>
            <TabsTrigger value="urgentes">Urgentes</TabsTrigger>
            <TabsTrigger value="hoy">Para Hoy</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {sortedTareas.length === 0 ? (
              <div className="text-center p-10 border rounded-lg">
                <p className="mb-4">No hay tareas {activeTab !== 'todas' ? `${activeTab}` : 'registradas'}</p>
                <Button onClick={handleAddNew}>Agregar Tarea</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTareas.map((tarea) => (
                  <Card 
                    key={tarea.id} 
                    className={`overflow-hidden transition-all hover:shadow-md ${getCardColorClass(tarea)}`}
                  >
                    <CardHeader className="p-4 pb-2 flex flex-row justify-between">
                      <div>
                        <CardTitle className="flex items-center text-base">
                          {getStatusIcon(tarea)}
                          <span className="ml-2 truncate">{tarea.tipoTarea}</span>
                        </CardTitle>
                        <CardDescription>
                          Cliente: {getClienteNombre(tarea.clienteId)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          tarea.prioridad === 'baja' ? 'bg-green-100 text-green-800' :
                          tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          tarea.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="mb-3 font-medium">{tarea.descripcion}</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Responsable:</span> {tarea.responsable}</p>
                        <p><span className="font-medium">Fecha límite:</span> {format(new Date(tarea.fechaLimite), 'dd/MM/yyyy', { locale: es })}</p>
                        <p>
                          <span className="font-medium">Estado:</span>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                            tarea.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            tarea.estado === 'en progreso' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {tarea.estado === 'pendiente' ? 'Pendiente' : 
                             tarea.estado === 'en progreso' ? 'En Progreso' : 'Completada'}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                      {tarea.estado !== 'completada' && (
                        <>
                          {tarea.estado === 'pendiente' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleInProgressTask(tarea)}
                              className="flex-1"
                            >
                              <Clock className="mr-1 h-4 w-4" /> En Progreso
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCompleteTask(tarea)}
                            className="flex-1"
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Completar
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(tarea)}
                        className="flex-1"
                      >
                        <Pencil className="mr-1 h-4 w-4" /> Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(tarea.id)}
                        className="flex-1"
                      >
                        <Trash className="mr-1 h-4 w-4" /> Eliminar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentTarea ? 'Editar Tarea' : 'Agregar Nueva Tarea'}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con los detalles de la tarea.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientes.map(cliente => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoTarea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Tarea</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposTarea.map(tipo => (
                              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción detallada de la tarea..."
                            {...field}
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del responsable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="en progreso">En Progreso</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaLimite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Límite</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaRecordatorio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Recordatorio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prioridad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una prioridad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="baja">Baja</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="urgente">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {currentTarea ? 'Actualizar' : 'Guardar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Tareas;
