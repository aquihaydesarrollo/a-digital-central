
import React from 'react';
import Layout from '../components/Layout/Layout';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle } from 'lucide-react';

const QuienesSomos = () => {
  const { asesoria } = useApp();
  
  const equipo = [
    {
      nombre: "María González",
      puesto: "Directora General",
      imagen: null,
      descripcion: "Experta en asesoría fiscal con más de 15 años de experiencia en el sector."
    },
    {
      nombre: "Carlos Rodríguez",
      puesto: "Director Financiero",
      imagen: null,
      descripcion: "Especialista en contabilidad y finanzas con amplia experiencia en gestión empresarial."
    },
    {
      nombre: "Laura Martínez",
      puesto: "Asesora Laboral",
      imagen: null,
      descripcion: "Profesional con amplia experiencia en derecho laboral y gestión de recursos humanos."
    },
    {
      nombre: "Antonio Pérez",
      puesto: "Asesor Jurídico",
      imagen: null,
      descripcion: "Abogado especializado en derecho mercantil y asesoramiento a empresas."
    }
  ];
  
  const valores = [
    {
      titulo: "Profesionalidad",
      descripcion: "Nos comprometemos a ofrecer un servicio de máxima calidad, basado en la profesionalidad y la excelencia en cada proyecto que abordamos."
    },
    {
      titulo: "Cercanía",
      descripcion: "Creemos en la importancia de establecer relaciones cercanas con nuestros clientes, basadas en la confianza y la comunicación fluida."
    },
    {
      titulo: "Innovación",
      descripcion: "Apostamos por la innovación y la mejora continua, adaptándonos a los cambios del entorno para ofrecer soluciones efectivas."
    },
    {
      titulo: "Compromiso",
      descripcion: "Nos comprometemos con los objetivos de nuestros clientes, trabajando con dedicación para conseguir los mejores resultados."
    },
    {
      titulo: "Confidencialidad",
      descripcion: "Garantizamos la máxima confidencialidad en el tratamiento de la información de nuestros clientes."
    },
    {
      titulo: "Experiencia",
      descripcion: "Contamos con un equipo de profesionales con amplia experiencia en sus respectivas áreas de especialización."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Quiénes Somos</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Conoce nuestra historia, valores y el equipo que forma parte de {asesoria?.nombre || 'Asesoría Digital'}.
            </p>
          </div>
        </div>
      </section>

      {/* Historia y Misión */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-12">
              <h2 className="text-3xl font-bold text-primary mb-6">Nuestra Historia</h2>
              <p className="text-gray-600 mb-4">
                {asesoria?.nombre || 'Asesoría Digital'} nace en 2008 con el objetivo de ofrecer servicios profesionales de asesoramiento a empresas y autónomos. Desde nuestros inicios, nos hemos caracterizado por ofrecer un servicio cercano y personalizado, adaptado a las necesidades específicas de cada cliente.
              </p>
              <p className="text-gray-600 mb-4">
                A lo largo de estos años, hemos crecido y evolucionado, incorporando nuevos servicios y profesionales a nuestro equipo, pero manteniendo siempre nuestra filosofía de trabajo basada en la cercanía, la profesionalidad y el compromiso con nuestros clientes.
              </p>
              <p className="text-gray-600">
                Actualmente, contamos con un equipo multidisciplinar de profesionales altamente cualificados y con amplia experiencia en sus respectivas áreas de especialización, lo que nos permite ofrecer un servicio integral y de calidad.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-primary mb-4">Misión y Visión</h3>
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-secondary-dark mb-2">Nuestra Misión</h4>
                  <p className="text-gray-600">
                    Proporcionar servicios profesionales de alta calidad en las áreas fiscal, contable, laboral y jurídica, contribuyendo al éxito y crecimiento de nuestros clientes a través de soluciones eficientes y personalizadas.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-secondary-dark mb-2">Nuestra Visión</h4>
                  <p className="text-gray-600">
                    Ser una firma de referencia en el sector de la asesoría, reconocida por la calidad de sus servicios y la satisfacción de sus clientes, adaptándonos constantemente a las nuevas necesidades y retos del mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Nuestros Valores</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Estos son los principios que guían nuestro trabajo diario y nuestra relación con los clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((valor, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">{valor.titulo}</h3>
                  <p className="text-gray-600">{valor.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Nuestro Equipo</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contamos con un equipo de profesionales altamente cualificados y con amplia experiencia en sus áreas de especialización.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipo.map((miembro, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                    {miembro.imagen ? (
                      <img 
                        src={miembro.imagen} 
                        alt={miembro.nombre} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-primary">{miembro.nombre}</h3>
                  <p className="text-secondary-dark font-medium mb-3">{miembro.puesto}</p>
                  <p className="text-gray-600">{miembro.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios e Información */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Nuestros Servicios y Áreas de Especialización</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para ayudarte a gestionar tu negocio de manera eficiente.
            </p>
          </div>
          
          <Tabs defaultValue="fiscal" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
              <TabsTrigger value="contable">Contable</TabsTrigger>
              <TabsTrigger value="laboral">Laboral</TabsTrigger>
              <TabsTrigger value="juridico">Jurídico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fiscal" className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary mb-4">Asesoría Fiscal</h3>
              <p className="text-gray-600 mb-4">
                Nuestros servicios de asesoría fiscal incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Declaraciones de impuestos (IRPF, IVA, Sociedades)</li>
                <li>Planificación fiscal</li>
                <li>Representación ante la Administración Tributaria</li>
                <li>Consultas y recursos tributarios</li>
                <li>Análisis de operaciones con trascendencia fiscal</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="contable" className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary mb-4">Asesoría Contable</h3>
              <p className="text-gray-600 mb-4">
                Nuestros servicios de asesoría contable incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Llevanza de contabilidad</li>
                <li>Elaboración de libros contables</li>
                <li>Elaboración de cuentas anuales</li>
                <li>Análisis económico-financiero</li>
                <li>Contabilidad de sociedades</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="laboral" className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary mb-4">Asesoría Laboral</h3>
              <p className="text-gray-600 mb-4">
                Nuestros servicios de asesoría laboral incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Gestión de nóminas y seguros sociales</li>
                <li>Contratos de trabajo</li>
                <li>Altas, bajas y modificaciones en la Seguridad Social</li>
                <li>Representación ante la Inspección de Trabajo</li>
                <li>Asesoramiento en materia laboral</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="juridico" className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary mb-4">Asesoría Jurídica</h3>
              <p className="text-gray-600 mb-4">
                Nuestros servicios de asesoría jurídica incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Constitución y modificación de sociedades</li>
                <li>Redacción y revisión de contratos mercantiles</li>
                <li>Protección de datos</li>
                <li>Reclamaciones y procedimientos administrativos</li>
                <li>Asesoramiento legal a empresas</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default QuienesSomos;
