
import React from 'react';
import Layout from '../components/Layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUp } from '@clerk/clerk-react';

const Registro = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Regístrate para acceder a nuestros servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUp
              routing="path"
              path="/registro"
              afterSignUpUrl="/admin"
              signInUrl="/login"
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-xs text-muted-foreground text-center mt-4">
              <p>Al registrarte, aceptas nuestros términos y condiciones</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Registro;
