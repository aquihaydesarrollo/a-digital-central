
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '../contexts/AppContext';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { asesoria } = useApp();
  
  const servicios = [
    {
      icon: '💼',
      title: 'Asesoría Fiscal',
      description: 'Optimización de impuestos y cumplimiento normativo para empresas y autónomos.',
      link: '/servicios#fiscal'
    },
    {
      icon: '📊',
      title: 'Asesoría Contable',
      description: 'Gestión contable profesional adaptada a las necesidades de tu negocio.',
      link: '/servicios#contable'
    },
    {
      icon: '👥',
      title: 'Asesoría Laboral',
      description: 'Gestión integral de nóminas, contratos y obligaciones con la Seguridad Social.',
      link: '/servicios#laboral'
    },
    {
      icon: '⚖️',
      title: 'Asesoría Jurídica',
      description: 'Asesoramiento legal especializado para proteger y hacer crecer tu empresa.',
      link: '/servicios#juridica'
    }
  ];
  
  const ventajas = [
    {
      titulo: 'Experiencia',
      descripcion: 'Más de 15 años de experiencia en asesoramiento a empresas y autónomos.'
    },
    {
      titulo: 'Personalización',
      descripcion: 'Soluciones adaptadas a las necesidades específicas de cada cliente.'
    },
    {
      titulo: 'Tecnología',
      descripcion: 'Utilizamos las últimas tecnologías para ofrecer un servicio eficiente y de calidad.'
    },
    {
      titulo: 'Atención',
      descripcion: 'Atención personalizada y cercana, siempre disponibles para resolver tus dudas.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-secondary-dark text-white py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Soluciones integrales para tu negocio
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                En {asesoria?.nombre || 'Asesoría Digital'} ofrecemos servicios profesionales de asesoría fiscal, contable, laboral y jurídica para empresas y autónomos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/servicios">
                  <Button size="lg" className="rounded-full bg-white text-primary hover:bg-primary-50">
                    Nuestros Servicios
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                    Contactar
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="/placeholder.svg" 
                alt="Asesoría Profesional" 
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para ayudarte a gestionar tu negocio de manera eficiente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicios.map((servicio, index) => (
              <Card key={index} className="hover-scale border-none shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-4xl mb-4">{servicio.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">{servicio.title}</h3>
                  <p className="text-gray-600 mb-4">{servicio.description}</p>
                  <Link to={servicio.link} className="mt-auto">
                    <Button variant="link" className="text-secondary-dark hover:text-primary flex items-center">
                      Saber más <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/servicios">
              <Button size="lg" className="rounded-full">
                Ver todos los servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">¿Por qué elegirnos?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Contamos con un equipo de profesionales altamente cualificados y con amplia experiencia en el sector, lo que nos permite ofrecer un servicio de calidad adaptado a tus necesidades.
              </p>
              
              <ul className="space-y-4">
                {ventajas.map((ventaja, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-primary rounded-full p-1 text-white mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary text-lg">{ventaja.titulo}</h4>
                      <p className="text-gray-600">{ventaja.descripcion}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link to="/quienes-somos">
                  <Button className="rounded-full">
                    Conoce más sobre nosotros
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="/placeholder.svg" 
                alt="Equipo profesional" 
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para optimizar la gestión de tu negocio?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Contáctanos hoy mismo y descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contacto">
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-primary-50">
                Solicitar información
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                Área de clientes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
