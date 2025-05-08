
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCarrito } from '../../utils/localStorage';

const Navbar = () => {
  const { isLoggedIn, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const carrito = getCarrito();
  const itemCount = carrito.items.reduce((sum, item) => sum + item.cantidad, 0);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-poppins font-bold text-xl">Asesoría</span>
              <span className="text-secondary-light ml-1 font-poppins font-bold text-xl">Digital</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>
              Inicio
            </Link>
            
            <Link to="/quienes-somos" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/quienes-somos') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>
              Quiénes Somos
            </Link>
            
            <Link to="/servicios" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/servicios') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>
              Servicios
            </Link>

            <Link to="/carrito" className="relative mr-4">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/admin" className="mr-2">
                  <Button variant="outline" size="sm">Panel Admin</Button>
                </Link>
                <Button onClick={logout} size="sm" variant="default">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/carrito" className="relative mr-4">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Button variant="ghost" onClick={toggleMobileMenu} size="sm">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
          <Link to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-primary font-semibold' : 'text-gray-600'}`}
            onClick={toggleMobileMenu}>
            Inicio
          </Link>
          
          <Link to="/quienes-somos" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/quienes-somos') ? 'text-primary font-semibold' : 'text-gray-600'}`}
            onClick={toggleMobileMenu}>
            Quiénes Somos
          </Link>
          
          <Link to="/servicios" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/servicios') ? 'text-primary font-semibold' : 'text-gray-600'}`}
            onClick={toggleMobileMenu}>
            Servicios
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/admin" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin') ? 'text-primary font-semibold' : 'text-gray-600'}`}
                onClick={toggleMobileMenu}>
                Panel Admin
              </Link>
              
              <Button onClick={() => { logout(); toggleMobileMenu(); }} 
                className="block w-full mt-2 text-left px-3 py-2">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link to="/login" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600"
              onClick={toggleMobileMenu}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
