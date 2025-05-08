
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAsesoria, updateAsesoria, initializeApp } from '../../utils/localStorage';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Key, 
  Save, 
  RefreshCw, 
  Trash,
  AlertCircle
} from 'lucide-react';

const Configuracion = () => {
  const { refreshData, asesoria } = useApp();
  const [datosAsesoria, setDatosAsesoria] = useState(asesoria || getAsesoria());
  const [enviarCopiaEmail, setEnviarCopiaEmail] = useState(true);
  const [notificacionesPush, setNotificacionesPush] = useState(true);
  const [recordatorios, setRecordatorios] = useState(true);

  const handleAsesoriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatosAsesoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarAsesoria = () => {
    updateAsesoria(datosAsesoria);
    refreshData();
    toast.success('Datos de la asesoría actualizados correctamente');
  };

  const handleResetDatos = () => {
    if (window.confirm('¿Está seguro de que desea reiniciar todos los datos de la aplicación? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      initializeApp();
      refreshData();
      toast.success('Todos los datos han sido reiniciados correctamente');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Configuración</h1>
        </div>

        <Tabs defaultValue="perfil">
          <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="asesoría">Asesoría</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Perfil */}
          <TabsContent value="perfil" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal y las preferencias de tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar y nombre */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-medium text-lg">Administrador</h3>
                    <p className="text-sm text-muted-foreground">admin@asesoria.es</p>
                    <div className="flex justify-center sm:justify-start gap-2 mt-2">
                      <Button variant="outline" size="sm">Cambiar Imagen</Button>
                      <Button variant="ghost" size="sm">Eliminar</Button>
                    </div>
                  </div>
                </div>
                
                {/* Formulario */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="nombre"
                          placeholder="Tu nombre"
                          value="Administrador"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value="admin@asesoria.es"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value="********"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración de notificaciones */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Preferencias de Notificación</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Notificaciones por email</h4>
                      <p className="text-muted-foreground text-sm">Recibir notificaciones por correo electrónico</p>
                    </div>
                    <Switch 
                      checked={enviarCopiaEmail}
                      onCheckedChange={setEnviarCopiaEmail}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Notificaciones push</h4>
                      <p className="text-muted-foreground text-sm">Recibir notificaciones en el navegador</p>
                    </div>
                    <Switch 
                      checked={notificacionesPush}
                      onCheckedChange={setNotificacionesPush}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Recordatorios de tareas</h4>
                      <p className="text-muted-foreground text-sm">Recibir recordatorios de tareas pendientes</p>
                    </div>
                    <Switch 
                      checked={recordatorios}
                      onCheckedChange={setRecordatorios}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={() => toast.success('Perfil actualizado correctamente')}>
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Asesoría */}
          <TabsContent value="asesoría" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos de la Asesoría</CardTitle>
                <CardDescription>
                  Configura la información general de tu asesoría.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-asesoria">Nombre de la Asesoría</Label>
                    <div className="relative">
                      <Building className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nombre-asesoria"
                        name="nombre"
                        placeholder="Nombre de la asesoría"
                        value={datosAsesoria.nombre}
                        onChange={handleAsesoriaChange}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cif">CIF</Label>
                    <Input
                      id="cif"
                      name="cif"
                      placeholder="B12345678"
                      value={datosAsesoria.cif}
                      onChange={handleAsesoriaChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="direccion"
                        name="direccion"
                        placeholder="Dirección completa"
                        value={datosAsesoria.direccion}
                        onChange={handleAsesoriaChange}
                        className="resize-none pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefono"
                          name="telefono"
                          placeholder="912345678"
                          value={datosAsesoria.telefono}
                          onChange={handleAsesoriaChange}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-asesoria">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-asesoria"
                          name="email"
                          type="email"
                          placeholder="contacto@asesoria.es"
                          value={datosAsesoria.email}
                          onChange={handleAsesoriaChange}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleGuardarAsesoria}>
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Sistema */}
          <TabsContent value="sistema" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Opciones avanzadas y mantenimiento del sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Datos</h3>
                  
                  <div className="rounded-lg border p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Realizar copia de seguridad</h4>
                        <p className="text-sm text-muted-foreground">Guarda una copia de todos los datos</p>
                      </div>
                      <Button variant="outline" onClick={() => toast.success('Copia de seguridad realizada correctamente')}>
                        Exportar Datos
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Restaurar datos</h4>
                        <p className="text-sm text-muted-foreground">Restaura datos desde una copia de seguridad</p>
                      </div>
                      <Button variant="outline">Importar Datos</Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-destructive flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> Reiniciar datos
                        </h4>
                        <p className="text-sm text-muted-foreground">Elimina todos los datos y vuelve a la configuración inicial</p>
                      </div>
                      <Button variant="destructive" onClick={handleResetDatos}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Reiniciar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Cuenta</h3>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-destructive flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> Eliminar cuenta
                        </h4>
                        <p className="text-sm text-muted-foreground">Elimina permanentemente tu cuenta y todos los datos asociados</p>
                      </div>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Configuracion;
