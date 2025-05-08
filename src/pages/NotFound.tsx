
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-md text-center px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, no hemos podido encontrar la página que estás buscando.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          <p>URL no encontrada: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span></p>
        </div>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">Ir al inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contacto">Contactar soporte</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
