
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { getCarrito, updateCarritoItem, clearCarrito, getAll, Servicio } from '../utils/localStorage';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Carrito = () => {
  const [carrito, setCarrito] = useState(getCarrito());
  const [servicios, setServicios] = useState<Record<string, Servicio>>({});

  useEffect(() => {
    const todosServicios = getAll<Servicio>('servicios');
    const serviciosMap: Record<string, Servicio> = {};
    todosServicios.forEach(servicio => {
      serviciosMap[servicio.id] = servicio;
    });
    setServicios(serviciosMap);
  }, []);

  const handleUpdateCantidad = (itemId: string, cantidad: number) => {
    const updatedCarrito = updateCarritoItem(itemId, cantidad);
    setCarrito(updatedCarrito);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedCarrito = updateCarritoItem(itemId, 0);
    setCarrito(updatedCarrito);
    toast.success('Servicio eliminado del carrito');
  };

  const handleClearCarrito = () => {
    const emptyCarrito = clearCarrito();
    setCarrito(emptyCarrito);
    toast.success('Carrito vaciado correctamente');
  };

  const handleCheckout = () => {
    toast.success('Procesando pedido...', {
      description: 'Su pedido ha sido recibido, le contactaremos a la brevedad.'
    });
    
    // En una aplicación real, aquí se redigiría a una pasarela de pago o
    // se enviaría la información a un backend para procesarla
    
    const emptyCarrito = clearCarrito();
    setCarrito(emptyCarrito);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2 md:mb-0">Mi Carrito</h1>
          {carrito.items.length > 0 && (
            <Button variant="ghost" className="text-gray-500" onClick={handleClearCarrito}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar carrito
            </Button>
          )}
        </div>

        {carrito.items.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 flex flex-col items-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Parece que aún no has añadido ningún servicio a tu carrito. Explora nuestros servicios para encontrar lo que necesitas.
              </p>
              <Link to="/servicios">
                <Button>Ver servicios disponibles</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Servicios en tu carrito</CardTitle>
                </CardHeader>
                <CardContent>
                  {carrito.items.map((item) => {
                    const servicio = servicios[item.servicioId];
                    if (!servicio) return null;
                    
                    return (
                      <div key={item.id} className="mb-4 last:mb-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                            <img
                              src={servicio.imagen || "/placeholder.svg"}
                              alt={servicio.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow sm:ml-4">
                            <h3 className="font-semibold text-lg text-primary">{servicio.nombre}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{servicio.descripcion}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleUpdateCantidad(item.id, item.cantidad - 1)}
                                  disabled={item.cantidad <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="mx-3 text-gray-700 font-medium">{item.cantidad}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleUpdateCantidad(item.id, item.cantidad + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-primary">
                                  {(item.precio * item.cantidad).toLocaleString('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR'
                                  })}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-red-500 p-1 h-auto"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">
                        {carrito.total.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">IVA (21%)</span>
                      <span className="font-medium">
                        {(carrito.total * 0.21).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        {(carrito.total * 1.21).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>

                    <div className="pt-4">
                      <div className="mb-4">
                        <label className="text-sm font-medium mb-1 block">Código promocional</label>
                        <div className="flex">
                          <Input placeholder="Introduce tu código" className="rounded-r-none" />
                          <Button variant="secondary" className="rounded-l-none">Aplicar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleCheckout}
                  >
                    Finalizar pedido
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      <strong>Nota:</strong> Al realizar el pedido, un asesor se pondrá en contacto contigo para concretar los detalles del servicio.
                    </p>
                    <p className="text-sm text-gray-500">
                      Si necesitas más información antes de contratar, no dudes en contactarnos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(servicios).slice(0, 3).map((servicio) => (
              <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">{servicio.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{servicio.descripcion}</p>
                  <p className="font-semibold text-primary">
                    {servicio.precio.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const updatedCarrito = updateCarritoItem(
                        carrito.items.find(i => i.servicioId === servicio.id)?.id || '',
                        1
                      );
                      setCarrito(updatedCarrito);
                      toast.success('Servicio añadido al carrito');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Carrito;
