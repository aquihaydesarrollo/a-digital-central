
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
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  Mail, Phone, Calendar, UserCheck 
} from 'lucide-react';
import { toast } from 'sonner';
import { getAll, save, remove, Empleado } from '../../utils/localStorage';

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState<Partial<Empleado>>({
    nombre: '',
    dni: '',
    puesto: '',
    email: '',
    fechaAlta: new Date(),
    fechaBaja: null
  });

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = () => {
    const empleadosData = getAll<Empleado>('empleados');
    setEmpleados(empleadosData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmpleados = empleados.filter(empleado => 
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewDialog = () => {
    setCurrentEmpleado(null);
    setFormData({
      nombre: '',
      dni: '',
      puesto: '',
      email: '',
      fechaAlta: new Date(),
      fechaBaja: null
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (empleado: Empleado) => {
    setCurrentEmpleado(empleado);
    setFormData({ 
      ...empleado, 
      fechaAlta: new Date(empleado.fechaAlta),
      fechaBaja: empleado.fechaBaja ? new Date(empleado.fechaBaja) : null
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (empleado: Empleado) => {
    setCurrentEmpleado(empleado);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'fechaAlta' | 'fechaBaja') => {
    const value = e.target.value ? new Date(e.target.value) : null;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEmpleado = () => {
    try {
      const asesoria = JSON.parse(localStorage.getItem('asesoria') || '{}');
      
      const empleadoData: Empleado = {
        ...(currentEmpleado || {}),
        ...formData,
        id: currentEmpleado?.id || '',
        asesoriaId: asesoria.id || 'default-asesoria'
      } as Empleado;
      
      save('empleados', empleadoData);
      setIsDialogOpen(false);
      loadEmpleados();
      
      toast.success(
        currentEmpleado ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente',
        { description: `${empleadoData.nombre} ha sido ${currentEmpleado ? 'actualizado' : 'añadido'} al sistema.` }
      );
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      toast.error('Error al guardar empleado', { 
        description: 'Ha ocurrido un error al intentar guardar los datos. Inténtelo de nuevo.' 
      });
    }
  };

  const handleDeleteEmpleado = () => {
    if (currentEmpleado) {
      remove('empleados', currentEmpleado.id);
      setIsDeleteDialogOpen(false);
      loadEmpleados();
      
      toast.success('Empleado eliminado', {
        description: `${currentEmpleado.nombre} ha sido eliminado del sistema.`
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Empleados</h1>
            <p className="text-gray-500">Gestión de empleados de la asesoría</p>
          </div>
          <Button onClick={handleOpenNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        {/* Tabla de Empleados */}
        <div className="border rounded-md">
          <Table>
            <TableCaption>Listado de empleados registrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha Alta</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpleados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {searchTerm 
                      ? 'No se encontraron empleados que coincidan con la búsqueda' 
                      : 'No hay empleados registrados. Añade un nuevo empleado para empezar.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmpleados.map(empleado => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">{empleado.nombre}</TableCell>
                    <TableCell>{empleado.dni}</TableCell>
                    <TableCell>{empleado.puesto}</TableCell>
                    <TableCell>
                      <a href={`mailto:${empleado.email}`} className="text-primary hover:underline flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {empleado.email}
                      </a>
                    </TableCell>
                    <TableCell>{new Date(empleado.fechaAlta).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(empleado)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeleteDialog(empleado)}
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

      {/* Diálogo para crear/editar empleado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input 
                id="nombre" 
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dni">DNI/NIE</Label>
              <Input 
                id="dni" 
                name="dni"
                value={formData.dni || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="puesto">Puesto</Label>
              <Input 
                id="puesto" 
                name="puesto"
                value={formData.puesto || ''}
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
              <Label htmlFor="fechaAlta">Fecha de Alta</Label>
              <Input 
                id="fechaAlta" 
                name="fechaAlta"
                type="date"
                value={formData.fechaAlta ? new Date(formData.fechaAlta).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e, 'fechaAlta')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fechaBaja">Fecha de Baja (opcional)</Label>
              <Input 
                id="fechaBaja" 
                name="fechaBaja"
                type="date"
                value={formData.fechaBaja ? new Date(formData.fechaBaja).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e, 'fechaBaja')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEmpleado}>
              {currentEmpleado ? 'Actualizar Empleado' : 'Crear Empleado'}
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
              ¿Estás seguro de que deseas eliminar al empleado <strong>{currentEmpleado?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmpleado}>
              Eliminar Empleado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Empleados;
