
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  Phone, Mail, Eye, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { getAll, save, remove, Cliente } from '../../utils/localStorage';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombre: '',
    nif: '',
    direccion: '',
    telefono: '',
    email: '',
    personaContacto: '',
    periodicidadFiscal: '',
    modelosFiscales: '',
    tipoImpuesto: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = () => {
    const clientesData = getAll<Cliente>('clientes');
    setClientes(clientesData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredClientes = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewDialog = () => {
    setCurrentCliente(null);
    setFormData({
      nombre: '',
      nif: '',
      direccion: '',
      telefono: '',
      email: '',
      personaContacto: '',
      periodicidadFiscal: '',
      modelosFiscales: '',
      tipoImpuesto: ''
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setFormData({ ...cliente });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCliente = () => {
    try {
      const asesoria = JSON.parse(localStorage.getItem('asesoria') || '{}');
      
      const clienteData: Cliente = {
        ...(currentCliente || {}),
        ...formData,
        id: currentCliente?.id || '',
        asesoriaId: asesoria.id || 'default-asesoria'
      } as Cliente;
      
      save('clientes', clienteData);
      setIsDialogOpen(false);
      loadClientes();
      
      toast.success(
        currentCliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente',
        { description: `${clienteData.nombre} ha sido ${currentCliente ? 'actualizado' : 'añadido'} al sistema.` }
      );
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      toast.error('Error al guardar cliente', { 
        description: 'Ha ocurrido un error al intentar guardar los datos. Inténtelo de nuevo.' 
      });
    }
  };

  const handleDeleteCliente = () => {
    if (currentCliente) {
      remove('clientes', currentCliente.id);
      setIsDeleteDialogOpen(false);
      loadClientes();
      
      toast.success('Cliente eliminado', {
        description: `${currentCliente.nombre} ha sido eliminado del sistema.`
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Clientes</h1>
            <p className="text-gray-500">Gestión de clientes de la asesoría</p>
          </div>
          <Button onClick={handleOpenNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        {/* Tabla de Clientes */}
        <div className="border rounded-md">
          <Table>
            <TableCaption>Listado de clientes registrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {searchTerm 
                      ? 'No se encontraron clientes que coincidan con la búsqueda' 
                      : 'No hay clientes registrados. Añade un nuevo cliente para empezar.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map(cliente => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.nif}</TableCell>
                    <TableCell>
                      <a href={`mailto:${cliente.email}`} className="text-primary hover:underline flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {cliente.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`tel:${cliente.telefono}`} className="text-primary hover:underline flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {cliente.telefono}
                      </a>
                    </TableCell>
                    <TableCell>{cliente.personaContacto}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log("Ver detalles")}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(cliente)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeleteDialog(cliente)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo para crear/editar cliente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre / Razón Social</Label>
              <Input 
                id="nombre" 
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nif">NIF/CIF</Label>
              <Input 
                id="nif" 
                name="nif"
                value={formData.nif || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input 
                id="direccion" 
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personaContacto">Persona de Contacto</Label>
              <Input 
                id="personaContacto" 
                name="personaContacto"
                value={formData.personaContacto || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodicidadFiscal">Periodicidad Fiscal</Label>
              <Input 
                id="periodicidadFiscal" 
                name="periodicidadFiscal"
                value={formData.periodicidadFiscal || ''}
                onChange={handleInputChange}
                placeholder="Trimestral, Mensual..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelosFiscales">Modelos Fiscales</Label>
              <Input 
                id="modelosFiscales" 
                name="modelosFiscales"
                value={formData.modelosFiscales || ''}
                onChange={handleInputChange}
                placeholder="303, 390, 111..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipoImpuesto">Tipo Impuesto</Label>
              <Input 
                id="tipoImpuesto" 
                name="tipoImpuesto"
                value={formData.tipoImpuesto || ''}
                onChange={handleInputChange}
                placeholder="General, Reducido..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCliente}>
              {currentCliente ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-gray-500">
              ¿Estás seguro de que deseas eliminar al cliente <strong>{currentCliente?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCliente}>
              Eliminar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Clientes;
