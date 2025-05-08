
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Factura, Cliente, save, remove, getAll } from '../../utils/localStorage';
import { Plus, Pencil, Trash, FileSearch } from 'lucide-react';

// Esquema de validación para el formulario de factura
const facturaSchema = z.object({
  clienteId: z.string().min(1, {
    message: 'Debe seleccionar un cliente.',
  }),
  tipo: z.enum(['emitida', 'recibida'], {
    required_error: 'Debe seleccionar un tipo de factura.',
  }),
  numero: z.string().min(1, {
    message: 'El número de factura es requerido.',
  }),
  fecha: z.string().min(1, {
    message: 'La fecha es requerida.',
  }),
  concepto: z.string().min(1, {
    message: 'El concepto es requerido.',
  }),
  baseImponible: z.number({
    required_error: 'La base imponible es requerida.',
    invalid_type_error: 'Debe ser un número.',
  }).positive({
    message: 'La base imponible debe ser positiva.',
  }),
  iva: z.number({
    required_error: 'El IVA es requerido.',
    invalid_type_error: 'Debe ser un número.',
  }).nonnegative({
    message: 'El IVA no puede ser negativo.',
  }),
  estadoPago: z.enum(['pendiente', 'pagada', 'cancelada'], {
    required_error: 'Debe seleccionar un estado de pago.',
  }),
  metodoPago: z.string().min(1, {
    message: 'El método de pago es requerido.',
  }),
});

const Facturas = () => {
  const { refreshData } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFactura, setCurrentFactura] = useState<Factura | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vistaDetalle, setVistaDetalle] = useState<Factura | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  
  useEffect(() => {
    // Cargar facturas y clientes al montar el componente
    setFacturas(getAll<Factura>('facturas'));
    setClientes(getAll<Cliente>('clientes'));
  }, []);

  const form = useForm<z.infer<typeof facturaSchema>>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      clienteId: '',
      tipo: 'emitida',
      numero: '',
      fecha: new Date().toISOString().split('T')[0],
      concepto: '',
      baseImponible: 0,
      iva: 21,
      estadoPago: 'pendiente',
      metodoPago: 'Transferencia',
    },
  });

  // Ver detalle de factura
  const handleVerDetalle = (factura: Factura) => {
    setVistaDetalle(factura);
    setIsDetalleOpen(true);
  };

  const handleEdit = (factura: Factura) => {
    setCurrentFactura(factura);
    form.reset({
      clienteId: factura.clienteId,
      tipo: factura.tipo,
      numero: factura.numero,
      fecha: new Date(factura.fecha).toISOString().split('T')[0],
      concepto: factura.concepto,
      baseImponible: factura.baseImponible,
      iva: factura.iva,
      estadoPago: factura.estadoPago as 'pendiente' | 'pagada' | 'cancelada',
      metodoPago: factura.metodoPago,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta factura?')) {
      remove('facturas', id);
      setFacturas(getAll<Factura>('facturas'));
      refreshData();
      toast.success('Factura eliminada correctamente');
    }
  };

  const onSubmit = (values: z.infer<typeof facturaSchema>) => {
    const baseImponible = Number(values.baseImponible);
    const iva = Number(values.iva);
    const total = baseImponible + (baseImponible * (iva / 100));

    const facturaData: Factura = {
      id: currentFactura?.id || crypto.randomUUID(),
      clienteId: values.clienteId,
      tipo: values.tipo,
      numero: values.numero,
      fecha: new Date(values.fecha),
      concepto: values.concepto,
      baseImponible: baseImponible,
      iva: iva,
      total: total,
      estadoPago: values.estadoPago,
      metodoPago: values.metodoPago,
    };

    save('facturas', facturaData);
    setFacturas(getAll<Factura>('facturas'));
    refreshData();
    setIsDialogOpen(false);
    toast.success(currentFactura ? 'Factura actualizada correctamente' : 'Factura agregada correctamente');
    form.reset();
    setCurrentFactura(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setCurrentFactura(null);
    }
  };

  const handleAddNew = () => {
    form.reset({
      clienteId: '',
      tipo: 'emitida',
      numero: '',
      fecha: new Date().toISOString().split('T')[0],
      concepto: '',
      baseImponible: 0,
      iva: 21,
      estadoPago: 'pendiente',
      metodoPago: 'Transferencia',
    });
    setCurrentFactura(null);
    setIsDialogOpen(true);
  };

  // Calcular Total en tiempo real
  React.useEffect(() => {
    const baseImponible = form.watch('baseImponible') || 0;
    const iva = form.watch('iva') || 0;
  }, [form.watch('baseImponible'), form.watch('iva'), form]);

  const getClienteNombre = (clienteId: string): string => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Facturas</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Factura
          </Button>
        </div>

        {facturas.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="mb-4">No hay facturas registradas</p>
            <Button onClick={handleAddNew}>Agregar Factura</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>Lista de facturas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.numero}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${factura.tipo === 'emitida' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {factura.tipo === 'emitida' ? 'Emitida' : 'Recibida'}
                    </span>
                  </TableCell>
                  <TableCell>{getClienteNombre(factura.clienteId)}</TableCell>
                  <TableCell>{format(new Date(factura.fecha), 'dd/MM/yyyy', { locale: es })}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{factura.concepto}</TableCell>
                  <TableCell>{factura.total.toFixed(2)}€</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      factura.estadoPago === 'pagada' ? 'bg-green-100 text-green-800' : 
                      factura.estadoPago === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {factura.estadoPago === 'pagada' ? 'Pagada' : 
                       factura.estadoPago === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleVerDetalle(factura)}>
                      <FileSearch className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(factura)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(factura.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Formulario para agregar/editar factura */}
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentFactura ? 'Editar Factura' : 'Agregar Nueva Factura'}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con los datos de la factura.
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
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Factura</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="emitida">Emitida</SelectItem>
                            <SelectItem value="recibida">Recibida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="2023/001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="concepto"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Concepto</FormLabel>
                        <FormControl>
                          <Input placeholder="Servicios de asesoría..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="baseImponible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Imponible (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="iva"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IVA (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2">
                    <div>Total:</div>
                    <div className="font-bold">
                      {(
                        (form.watch('baseImponible') || 0) + 
                        ((form.watch('baseImponible') || 0) * ((form.watch('iva') || 0) / 100))
                      ).toFixed(2)}€
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="estadoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado de Pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="pagada">Pagada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago</FormLabel>
                        <FormControl>
                          <Input placeholder="Transferencia, efectivo..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {currentFactura ? 'Actualizar' : 'Guardar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para ver detalle de factura */}
        <Dialog open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Detalle de Factura
              </DialogTitle>
            </DialogHeader>

            {vistaDetalle && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Número:</div>
                  <div>{vistaDetalle.numero}</div>
                  
                  <div className="font-semibold">Tipo:</div>
                  <div>{vistaDetalle.tipo === 'emitida' ? 'Emitida' : 'Recibida'}</div>
                  
                  <div className="font-semibold">Cliente:</div>
                  <div>{getClienteNombre(vistaDetalle.clienteId)}</div>
                  
                  <div className="font-semibold">Fecha:</div>
                  <div>{format(new Date(vistaDetalle.fecha), 'dd/MM/yyyy', { locale: es })}</div>
                  
                  <div className="font-semibold">Concepto:</div>
                  <div>{vistaDetalle.concepto}</div>
                  
                  <div className="font-semibold">Base Imponible:</div>
                  <div>{vistaDetalle.baseImponible.toFixed(2)}€</div>
                  
                  <div className="font-semibold">IVA ({vistaDetalle.iva}%):</div>
                  <div>{(vistaDetalle.baseImponible * (vistaDetalle.iva / 100)).toFixed(2)}€</div>
                  
                  <div className="font-semibold">Total:</div>
                  <div className="font-bold">{vistaDetalle.total.toFixed(2)}€</div>
                  
                  <div className="font-semibold">Estado:</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vistaDetalle.estadoPago === 'pagada' ? 'bg-green-100 text-green-800' : 
                      vistaDetalle.estadoPago === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {vistaDetalle.estadoPago === 'pagada' ? 'Pagada' : 
                       vistaDetalle.estadoPago === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </div>
                  
                  <div className="font-semibold">Método de pago:</div>
                  <div>{vistaDetalle.metodoPago}</div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetalleOpen(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => {
                    setIsDetalleOpen(false);
                    handleEdit(vistaDetalle);
                  }}>
                    Editar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Facturas;
