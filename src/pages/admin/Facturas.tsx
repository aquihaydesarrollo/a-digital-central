
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  FileText, Download, Eye, CheckSquare 
} from 'lucide-react';
import { toast } from 'sonner';
import { getAll, save, remove, Factura, Cliente } from '../../utils/localStorage';

const Facturas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFactura, setCurrentFactura] = useState<Factura | null>(null);
  const [formData, setFormData] = useState<Partial<Factura>>({
    clienteId: '',
    tipo: 'emitida',
    numero: '',
    fecha: new Date(),
    concepto: '',
    baseImponible: 0,
    iva: 21,
    total: 0,
    estadoPago: 'pendiente',
    metodoPago: 'transferencia'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFacturas();
    loadClientes();
  }, []);

  useEffect(() => {
    // Calcular total cuando cambia base imponible o IVA
    if (formData.baseImponible !== undefined && formData.iva !== undefined) {
      const base = parseFloat(formData.baseImponible.toString()) || 0;
      const iva = parseFloat(formData.iva.toString()) || 0;
      const total = base + (base * (iva / 100));
      setFormData(prev => ({ ...prev, total }));
    }
  }, [formData.baseImponible, formData.iva]);

  const loadFacturas = () => {
    const facturasData = getAll<Factura>('facturas');
    setFacturas(facturasData);
  };

  const loadClientes = () => {
    const clientesData = getAll<Cliente>('clientes');
    setClientes(clientesData);
  };

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFacturas = facturas.filter(factura => 
    factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClienteName(factura.clienteId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewDialog = () => {
    setCurrentFactura(null);
    setFormData({
      clienteId: clientes.length > 0 ? clientes[0].id : '',
      tipo: 'emitida',
      numero: `F-${new Date().getFullYear()}-${String(facturas.length + 1).padStart(3, '0')}`,
      fecha: new Date(),
      concepto: '',
      baseImponible: 0,
      iva: 21,
      total: 0,
      estadoPago: 'pendiente',
      metodoPago: 'transferencia'
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (factura: Factura) => {
    setCurrentFactura(factura);
    setFormData({ 
      ...factura,
      fecha: new Date(factura.fecha)
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (factura: Factura) => {
    setCurrentFactura(factura);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar el error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? new Date(e.target.value) : new Date();
    setFormData(prev => ({ ...prev, fecha: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.clienteId) errors.clienteId = 'Seleccione un cliente';
    if (!formData.numero) errors.numero = 'Ingrese un número de factura';
    if (!formData.concepto) errors.concepto = 'Ingrese un concepto para la factura';
    if (formData.baseImponible === undefined || formData.baseImponible <= 0) 
      errors.baseImponible = 'Ingrese un valor válido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveFactura = () => {
    if (!validateForm()) return;
    
    try {
      const facturaData: Factura = {
        ...(currentFactura || {}),
        ...formData,
        id: currentFactura?.id || ''
      } as Factura;
      
      save('facturas', facturaData);
      setIsDialogOpen(false);
      loadFacturas();
      
      toast.success(
        currentFactura ? 'Factura actualizada correctamente' : 'Factura creada correctamente',
        { description: `La factura ${facturaData.numero} ha sido ${currentFactura ? 'actualizada' : 'creada'} correctamente.` }
      );
    } catch (error) {
      console.error('Error al guardar factura:', error);
      toast.error('Error al guardar factura', { 
        description: 'Ha ocurrido un error al intentar guardar los datos. Inténtelo de nuevo.' 
      });
    }
  };

  const handleDeleteFactura = () => {
    if (currentFactura) {
      remove('facturas', currentFactura.id);
      setIsDeleteDialogOpen(false);
      loadFacturas();
      
      toast.success('Factura eliminada', {
        description: `La factura ${currentFactura.numero} ha sido eliminada correctamente.`
      });
    }
  };

  const getEstadoPagoBadge = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pagada</Badge>;
      case 'pendiente':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendiente</Badge>;
      case 'vencida':
        return <Badge variant="destructive">Vencida</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleMarcarComoPagada = (factura: Factura) => {
    const facturaActualizada: Factura = {
      ...factura,
      estadoPago: 'pagada'
    };
    
    save('facturas', facturaActualizada);
    loadFacturas();
    
    toast.success('Estado actualizado', {
      description: `La factura ${factura.numero} ha sido marcada como pagada.`
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Facturas</h1>
            <p className="text-gray-500">Gestión de facturas de clientes</p>
          </div>
          <Button onClick={handleOpenNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar facturas por número, cliente o concepto..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        {/* Tabla de Facturas */}
        <div className="border rounded-md">
          <Table>
            <TableCaption>Listado de facturas registradas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    {searchTerm 
                      ? 'No se encontraron facturas que coincidan con la búsqueda' 
                      : 'No hay facturas registradas. Añade una nueva factura para empezar.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFacturas.map(factura => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        {factura.numero}
                      </div>
                    </TableCell>
                    <TableCell>{getClienteName(factura.clienteId)}</TableCell>
                    <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{factura.concepto}</TableCell>
                    <TableCell>
                      {factura.total.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </TableCell>
                    <TableCell>{getEstadoPagoBadge(factura.estadoPago)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(factura)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {factura.estadoPago !== 'pagada' && (
                            <DropdownMenuItem onClick={() => handleMarcarComoPagada(factura)}>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Marcar como pagada
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeleteDialog(factura)}
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

      {/* Diálogo para crear/editar factura */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentFactura ? 'Editar Factura' : 'Nueva Factura'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clienteId">Cliente</Label>
              <Select 
                value={formData.clienteId} 
                onValueChange={(value) => handleSelectChange('clienteId', value)}
              >
                <SelectTrigger id="clienteId" className={formErrors.clienteId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.clienteId && <p className="text-xs text-red-500">{formErrors.clienteId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Factura</Label>
              <Select 
                value={formData.tipo as string} 
                onValueChange={(value) => handleSelectChange('tipo', value)}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emitida">Emitida</SelectItem>
                  <SelectItem value="recibida">Recibida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numero">Número de Factura</Label>
              <Input 
                id="numero" 
                name="numero"
                value={formData.numero || ''}
                onChange={handleInputChange}
                className={formErrors.numero ? 'border-red-500' : ''}
              />
              {formErrors.numero && <p className="text-xs text-red-500">{formErrors.numero}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input 
                id="fecha" 
                name="fecha"
                type="date"
                value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estadoPago">Estado de Pago</Label>
              <Select 
                value={formData.estadoPago as string} 
                onValueChange={(value) => handleSelectChange('estadoPago', value)}
              >
                <SelectTrigger id="estadoPago">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="concepto">Concepto</Label>
              <Input 
                id="concepto" 
                name="concepto"
                value={formData.concepto || ''}
                onChange={handleInputChange}
                className={formErrors.concepto ? 'border-red-500' : ''}
              />
              {formErrors.concepto && <p className="text-xs text-red-500">{formErrors.concepto}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseImponible">Base Imponible (€)</Label>
              <Input 
                id="baseImponible" 
                name="baseImponible"
                type="number"
                step="0.01"
                value={formData.baseImponible || ''}
                onChange={handleInputChange}
                className={formErrors.baseImponible ? 'border-red-500' : ''}
              />
              {formErrors.baseImponible && <p className="text-xs text-red-500">{formErrors.baseImponible}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iva">IVA (%)</Label>
              <Input 
                id="iva" 
                name="iva"
                type="number"
                value={formData.iva || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total">Total (€)</Label>
              <Input 
                id="total" 
                name="total"
                type="number"
                step="0.01"
                value={formData.total || ''}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metodoPago">Método de Pago</Label>
              <Select 
                value={formData.metodoPago as string} 
                onValueChange={(value) => handleSelectChange('metodoPago', value)}
              >
                <SelectTrigger id="metodoPago">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="domiciliacion">Domiciliación Bancaria</SelectItem>
                  <SelectItem value="bizum">Bizum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFactura}>
              {currentFactura ? 'Actualizar Factura' : 'Crear Factura'}
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
              ¿Estás seguro de que deseas eliminar la factura <strong>{currentFactura?.numero}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteFactura}>
              Eliminar Factura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Facturas;
