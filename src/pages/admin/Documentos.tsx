
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Documento, Cliente, save, remove, getAll } from '../../utils/localStorage';
import { Plus, Pencil, Trash, FileText, Download, Eye } from 'lucide-react';

// Esquema de validación para el formulario de documento
const documentoSchema = z.object({
  clienteId: z.string().min(1, {
    message: 'Debe seleccionar un cliente.',
  }),
  tipo: z.string().min(1, {
    message: 'El tipo de documento es requerido.',
  }),
  descripcion: z.string().min(1, {
    message: 'La descripción es requerida.',
  }),
  urlArchivo: z.string().min(1, {
    message: 'La URL del archivo es requerida.',
  }),
  version: z.string().optional(),
});

const tiposDocumento = [
  'Contrato',
  'Factura',
  'Declaración',
  'Recibo',
  'Certificado',
  'Informe',
  'Escritura',
  'Otros'
];

const Documentos = () => {
  const { refreshData, currentUser } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState<Documento | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  useEffect(() => {
    // Cargar documentos y clientes al montar el componente
    setDocumentos(getAll<Documento>('documentos'));
    setClientes(getAll<Cliente>('clientes'));
  }, []);

  const form = useForm<z.infer<typeof documentoSchema>>({
    resolver: zodResolver(documentoSchema),
    defaultValues: {
      clienteId: '',
      tipo: '',
      descripcion: '',
      urlArchivo: '',
      version: '1.0',
    },
  });

  const handleEdit = (documento: Documento) => {
    setCurrentDocumento(documento);
    form.reset({
      clienteId: documento.clienteId,
      tipo: documento.tipo,
      descripcion: documento.descripcion,
      urlArchivo: documento.urlArchivo,
      version: documento.version,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      remove('documentos', id);
      setDocumentos(getAll<Documento>('documentos'));
      refreshData();
      toast.success('Documento eliminado correctamente');
    }
  };

  const onSubmit = (values: z.infer<typeof documentoSchema>) => {
    const documentoData: Documento = {
      id: currentDocumento?.id || crypto.randomUUID(),
      clienteId: values.clienteId,
      tipo: values.tipo,
      descripcion: values.descripcion,
      fechaSubida: currentDocumento?.fechaSubida || new Date(),
      urlArchivo: values.urlArchivo,
      version: values.version || '1.0',
      usuarioSubida: currentUser?.nombre || 'Usuario sistema',
    };

    save('documentos', documentoData);
    setDocumentos(getAll<Documento>('documentos'));
    refreshData();
    setIsDialogOpen(false);
    toast.success(currentDocumento ? 'Documento actualizado correctamente' : 'Documento agregado correctamente');
    form.reset();
    setCurrentDocumento(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setCurrentDocumento(null);
    }
  };

  const handleAddNew = () => {
    form.reset({
      clienteId: '',
      tipo: '',
      descripcion: '',
      urlArchivo: '',
      version: '1.0',
    });
    setCurrentDocumento(null);
    setIsDialogOpen(true);
  };

  const getClienteNombre = (clienteId: string): string => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const simulateFileDownload = (documento: Documento) => {
    // En una aplicación real, esto descargaría el archivo
    toast.info(`Simulando descarga del archivo: ${documento.descripcion}`);
  };

  const simulateFileView = (documento: Documento) => {
    // En una aplicación real, esto abriría el archivo para visualizarlo
    toast.info(`Simulando visualización del archivo: ${documento.descripcion}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Documentos</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Documento
          </Button>
        </div>

        {documentos.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="mb-4">No hay documentos registrados</p>
            <Button onClick={handleAddNew}>Agregar Documento</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>Lista de documentos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      {documento.tipo}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{documento.descripcion}</TableCell>
                  <TableCell>{getClienteNombre(documento.clienteId)}</TableCell>
                  <TableCell>{format(new Date(documento.fechaSubida), 'dd/MM/yyyy', { locale: es })}</TableCell>
                  <TableCell>{documento.version}</TableCell>
                  <TableCell>{documento.usuarioSubida}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => simulateFileView(documento)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => simulateFileDownload(documento)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(documento)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(documento.id)}>
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
                {currentDocumento ? 'Editar Documento' : 'Agregar Nuevo Documento'}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con los datos del documento.
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
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposDocumento.map(tipo => (
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
                            placeholder="Descripción detallada del documento..."
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
                    name="urlArchivo"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>URL del Archivo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://ejemplo.com/archivo.pdf" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versión</FormLabel>
                        <FormControl>
                          <Input placeholder="1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {currentDocumento ? 'Actualizar' : 'Guardar'}
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

export default Documentos;
