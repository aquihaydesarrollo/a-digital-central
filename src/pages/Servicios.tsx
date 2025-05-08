
import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAll, addToCarrito, Servicio } from '../utils/localStorage';
import { toast } from 'sonner';
import { ShoppingCart, Plus, Info } from 'lucide-react';

const Servicios = () => {
  const { asesoria } = useApp();
  const [servicios, setServicios] = useState<Servicio[]>(getAll('servicios'));
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const categorias = [
    { id: 'todos', label: 'Todos' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'contable', label: 'Contable' },
    { id: 'laboral', label: 'Laboral' },
    { id: 'juridico', label: 'Jurídico' },
    { id: 'consultoria', label: 'Consultoría' },
  ];

  const handleAddToCart = (servicio: Servicio) => {
    addToCarrito(servicio, 1);
    toast.success('Servicio añadido al carrito', {
      description: `Has añadido "${servicio.nombre}" a tu carrito.`,
      action: {
        label: 'Ver carrito',
        onClick: () => window.location.href = '/carrito'
      }
    });
  };

  const filteredServicios = activeCategory === 'todos'
    ? servicios
    : servicios.filter(s => s.categoria === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Descubre los servicios profesionales que {asesoria?.nombre || 'Asesoría Digital'} ofrece para impulsar tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Categorías y Listado de Servicios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            defaultValue="todos" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                {categorias.map(categoria => (
                  <TabsTrigger key={categoria.id} value={categoria.id}>
                    {categoria.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory}>
              {filteredServicios.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No hay servicios disponibles en esta categoría.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServicios.map((servicio) => (
                    <Card key={servicio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={servicio.imagen || "/placeholder.svg"}
                          alt={servicio.nombre}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {categorias.find(c => c.id === servicio.categoria)?.label || 'General'}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <h3 className="text-xl font-semibold text-primary">{servicio.nombre}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                        <p className="text-xl font-bold text-primary">
                          {servicio.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button
                          variant="default"
                          className="flex-1 mr-2"
                          onClick={() => handleAddToCart(servicio)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Añadir al carrito
                        </Button>
                        <Button variant="outline" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Destacados y Packs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Packs Especiales</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hemos diseñado paquetes especiales que combinan varios servicios para ofrecerte soluciones integrales a un precio más ventajoso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pack Emprendedor */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="text-xl font-bold text-primary">Pack Emprendedor</h3>
              </div>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Ideal para autónomos y pequeñas empresas que están comenzando su actividad.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Constitución de empresa o alta como autónomo</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Gestión contable básica (3 meses)</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Asesoramiento fiscal inicial</span>
                  </li>
                </ul>
                <p className="text-xl font-bold text-primary text-center">
                  499€
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Contratar Pack
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pack Pyme */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20 transform scale-105 shadow-lg">
              <div className="bg-primary text-white p-4 text-center">
                <h3 className="text-xl font-bold">Pack Pyme</h3>
                <Badge variant="secondary" className="mt-1">Más Popular</Badge>
              </div>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Solución completa para pequeñas y medianas empresas en crecimiento.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Contabilidad mensual completa</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Declaraciones trimestrales (IVA, IRPF)</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Gestión laboral (hasta 5 empleados)</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Asesoramiento fiscal y contable</span>
                  </li>
                </ul>
                <p className="text-xl font-bold text-primary text-center">
                  299€/mes
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" variant="default">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Contratar Pack
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pack Empresa */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
              <div className="bg-primary/10 p-4 text-center">
                <h3 className="text-xl font-bold text-primary">Pack Empresa</h3>
              </div>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Solución integral para empresas con necesidades avanzadas de gestión.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Contabilidad mensual avanzada</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Gestión fiscal completa</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Gestión laboral (hasta 15 empleados)</span>
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-green-500 mr-2" />
                    <span>Consultoría estratégica trimestral</span>
                  </li>
                </ul>
                <p className="text-xl font-bold text-primary text-center">
                  599€/mes
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Contratar Pack
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Servicios Adicionales */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-primary mb-4">Servicios Personalizados</h2>
              <p className="text-gray-600">
                Además de nuestros servicios estándar y packs, ofrecemos soluciones personalizadas adaptadas a las necesidades específicas de tu empresa.
              </p>
              <p className="text-gray-600 mt-4">
                Contáctanos para solicitar un presupuesto personalizado y descubrir cómo podemos ayudarte a alcanzar tus objetivos empresariales.
              </p>
              <div className="mt-6">
                <Button className="w-full md:w-auto">Solicitar Presupuesto</Button>
              </div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">Formación Empresarial</h3>
                  <p className="text-gray-600">
                    Programas de formación a medida para tu equipo en materia fiscal, contable, laboral o jurídica.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">Auditoría Interna</h3>
                  <p className="text-gray-600">
                    Revisión exhaustiva de tu contabilidad y procesos fiscales para detectar posibles áreas de mejora.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">Reestructuración Empresarial</h3>
                  <p className="text-gray-600">
                    Asesoramiento en procesos de reestructuración, fusiones o adquisiciones de empresas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">Internacionalización</h3>
                  <p className="text-gray-600">
                    Acompañamiento en el proceso de expansión internacional de tu empresa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Dudas sobre qué servicio se adapta mejor a tu negocio?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Nuestros asesores están a tu disposición para recomendarte la mejor solución según tus necesidades y presupuesto.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-primary-50">
              Solicitar asesoramiento gratuito
            </Button>
            <Link to="/carrito">
              <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ver mi carrito
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Servicios;
