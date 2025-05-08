
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Empleado, getAsesoria, save, remove } from '../../utils/localStorage';
import { Plus, Pencil, Trash } from 'lucide-react';

// Esquema de validación para el formulario de empleado
const empleadoSchema = z.object({
  nombre: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  dni: z.string().min(9, {
    message: 'El DNI debe tener al menos 9 caracteres.',
  }),
  puesto: z.string().min(2, {
    message: 'El puesto debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingrese un email válido.',
  }),
  fechaAlta: z.string().min(1, {
    message: 'La fecha de alta es requerida.',
  }),
  fechaBaja: z.string().optional(),
});

const Empleados = () => {
  const { empleados, refreshData, asesoria } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState<Empleado | null>(null);
  
  const form = useForm<z.infer<typeof empleadoSchema>>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      nombre: '',
      dni: '',
      puesto: '',
      email: '',
      fechaAlta: new Date().toISOString().split('T')[0],
      fechaBaja: '',
    },
  });

  const handleEdit = (empleado: Empleado) => {
    setCurrentEmpleado(empleado);
    form.reset({
      nombre: empleado.nombre,
      dni: empleado.dni,
      puesto: empleado.puesto,
      email: empleado.email,
      fechaAlta: new Date(empleado.fechaAlta).toISOString().split('T')[0],
      fechaBaja: empleado.fechaBaja 
        ? new Date(empleado.fechaBaja).toISOString().split('T')[0]
        : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      remove('empleados', id);
      refreshData();
      toast.success('Empleado eliminado correctamente');
    }
  };

  const onSubmit = (values: z.infer<typeof empleadoSchema>) => {
    const asesoriaData = getAsesoria();
    if (!asesoriaData) {
      toast.error('Error', { description: 'No se encuentra la información de la asesoría' });
      return;
    }

    const empleadoData: Empleado = {
      id: currentEmpleado?.id || crypto.randomUUID(),
      asesoriaId: asesoriaData.id,
      nombre: values.nombre,
      dni: values.dni,
      puesto: values.puesto,
      email: values.email,
      fechaAlta: new Date(values.fechaAlta),
      fechaBaja: values.fechaBaja ? new Date(values.fechaBaja) : null,
    };

    save('empleados', empleadoData);
    refreshData();
    setIsDialogOpen(false);
    toast.success(currentEmpleado ? 'Empleado actualizado correctamente' : 'Empleado agregado correctamente');
    form.reset();
    setCurrentEmpleado(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setCurrentEmpleado(null);
    }
  };

  const handleAddNew = () => {
    form.reset({
      nombre: '',
      dni: '',
      puesto: '',
      email: '',
      fechaAlta: new Date().toISOString().split('T')[0],
      fechaBaja: '',
    });
    setCurrentEmpleado(null);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Empleado
          </Button>
        </div>

        {empleados.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="mb-4">No hay empleados registrados</p>
            <Button onClick={handleAddNew}>Agregar Empleado</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>Lista de empleados de {asesoria?.nombre}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha Alta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">{empleado.nombre}</TableCell>
                  <TableCell>{empleado.dni}</TableCell>
                  <TableCell>{empleado.puesto}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{format(new Date(empleado.fechaAlta), 'dd/MM/yyyy', { locale: es })}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${empleado.fechaBaja ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {empleado.fechaBaja ? 'Inactivo' : 'Activo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(empleado)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(empleado.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentEmpleado ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con los datos del empleado.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="puesto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puesto</FormLabel>
                        <FormControl>
                          <Input placeholder="Contable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaAlta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Alta</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaBaja"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Baja (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dejar en blanco si el empleado sigue activo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {currentEmpleado ? 'Actualizar' : 'Guardar'}
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

export default Empleados;
