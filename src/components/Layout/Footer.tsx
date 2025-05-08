
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { asesoria } = useApp();

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-white font-poppins font-bold text-xl">Asesoría</span>
              <span className="text-primary-100 ml-1 font-poppins font-bold text-xl">Digital</span>
            </Link>
            <p className="mt-3 text-sm text-gray-300">
              Soluciones integrales de asesoría fiscal, contable, laboral y jurídica para empresas y autónomos.
            </p>
          </div>

          {/* Navegación rápida */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Área Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicios#fiscal" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Asesoría Fiscal
                </Link>
              </li>
              <li>
                <Link to="/servicios#contable" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Asesoría Contable
                </Link>
              </li>
              <li>
                <Link to="/servicios#laboral" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Asesoría Laboral
                </Link>
              </li>
              <li>
                <Link to="/servicios#juridica" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Asesoría Jurídica
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-300" />
                <span className="text-gray-300 text-sm">{asesoria?.direccion || 'Calle Gran Vía 123, 28013 Madrid'}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-300" />
                <a href={`tel:${asesoria?.telefono || '912345678'}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {asesoria?.telefono || '912 345 678'}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-300" />
                <a href={`mailto:${asesoria?.email || 'contacto@asesoriafiscal.es'}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {asesoria?.email || 'contacto@asesoriafiscal.es'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} Asesoría Digital. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Aviso Legal
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
