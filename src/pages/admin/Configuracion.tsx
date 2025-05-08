
import React, { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getAsesoria, updateAsesoria } from '../../utils/localStorage';
import { useApp } from '../../contexts/AppContext';

const Configuracion = () => {
  const { asesoria, refreshData } = useApp();
  const [formData, setFormData] = useState(asesoria || {
    nombre: '',
    cif: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarAjustes = () => {
    try {
      updateAsesoria({
        ...formData,
        id: asesoria?.id || ''
      });
      refreshData();
      toast.success('Configuración guardada', {
        description: 'Los datos de la asesoría han sido actualizados correctamente.'
      });
    } catch (error) {
      toast.error('Error al guardar', {
        description: 'Ha ocurrido un error al guardar la configuración. Inténtelo de nuevo.'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Configuración</h1>
          <p className="text-gray-500">Gestione los ajustes de su asesoría</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Datos de la asesoría</CardTitle>
                <CardDescription>
                  Actualice la información de su asesoría
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la asesoría</Label>
                  <Input 
                    id="nombre" 
                    name="nombre"
                    value={formData.nombre} 
                    onChange={handleInputChange}
                    placeholder="Nombre de la asesoría" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cif">CIF</Label>
                  <Input 
                    id="cif" 
                    name="cif"
                    value={formData.cif} 
                    onChange={handleInputChange}
                    placeholder="CIF de la asesoría" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    name="direccion"
                    value={formData.direccion} 
                    onChange={handleInputChange}
                    placeholder="Dirección completa" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      name="telefono"
                      value={formData.telefono} 
                      onChange={handleInputChange}
                      placeholder="Teléfono de contacto" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email} 
                      onChange={handleInputChange}
                      placeholder="Email de contacto" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGuardarAjustes}>Guardar cambios</Button>
              </CardFooter>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Logotipos e imagen</CardTitle>
                <CardDescription>
                  Personalice la imagen de su asesoría
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo principal</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-52 bg-gray-100 rounded flex items-center justify-center border">
                      <p className="text-gray-400">Logo actual</p>
                    </div>
                    <Button variant="outline">Cambiar logo</Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center border">
                      <p className="text-gray-400">Icon</p>
                    </div>
                    <Button variant="outline">Cambiar favicon</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de notificaciones</CardTitle>
                <CardDescription>
                  Configure cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones por email</p>
                    <p className="text-sm text-gray-500">Reciba notificaciones importantes en su email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recordatorios de tareas</p>
                    <p className="text-sm text-gray-500">Reciba recordatorios de tareas pendientes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de facturas pendientes</p>
                    <p className="text-sm text-gray-500">Notificaciones sobre facturas pendientes de pago</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones del sistema</p>
                    <p className="text-sm text-gray-500">Alertas sobre actualizaciones y mantenimiento</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Guardar preferencias</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de usuarios</CardTitle>
                <CardDescription>
                  Administre las cuentas de usuarios y sus permisos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Usuario</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Rol</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">Administrador</td>
                        <td className="px-6 py-4">admin@asesoria.es</td>
                        <td className="px-6 py-4">Administrador</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Activo</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Añadir usuario</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="seguridad">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Configure opciones de seguridad y acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticación de dos factores</p>
                    <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <Switch />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Registro de actividad</p>
                    <p className="text-sm text-gray-500">Mantener un registro detallado de la actividad de la cuenta</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Actualizar configuración de seguridad</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Configuracion;
