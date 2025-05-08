
import { v4 as uuidv4 } from 'uuid';

// Tipos para las entidades principales
export interface Asesoria {
  id: string;
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Cliente {
  id: string;
  asesoriaId: string;
  nombre: string;
  nif: string;
  direccion: string;
  telefono: string;
  email: string;
  personaContacto: string;
  periodicidadFiscal: string;
  modelosFiscales: string;
  tipoImpuesto: string;
}

export interface Empleado {
  id: string;
  asesoriaId: string;
  nombre: string;
  dni: string;
  puesto: string;
  email: string;
  fechaAlta: Date;
  fechaBaja: Date | null;
}

export interface EmpleadoCliente {
  id: string;
  clienteId: string;
  nombre: string;
  dni: string;
  puesto: string;
  fechaAlta: Date;
  fechaBaja: Date | null;
  tipoContrato: string;
  jornada: string;
  salarioBase: number;
  complementos: number;
  deducciones: number;
  irpf: number;
  ss: number;
}

export interface Factura {
  id: string;
  clienteId: string;
  tipo: 'emitida' | 'recibida';
  numero: string;
  fecha: Date;
  concepto: string;
  baseImponible: number;
  iva: number;
  total: number;
  estadoPago: string;
  metodoPago: string;
}

export interface Documento {
  id: string;
  clienteId: string;
  tipo: string;
  descripcion: string;
  fechaSubida: Date;
  urlArchivo: string;
  version: string;
  usuarioSubida: string;
}

export interface Tarea {
  id: string;
  clienteId: string;
  descripcion: string;
  responsable: string;
  fechaLimite: Date;
  estado: 'pendiente' | 'en progreso' | 'completada';
  tipoTarea: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fechaRecordatorio: Date;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
}

export interface ItemCarrito {
  id: string;
  servicioId: string;
  cantidad: number;
  precio: number;
}

export interface Carrito {
  items: ItemCarrito[];
  total: number;
}

// Configuración inicial de la aplicación
export const initializeApp = () => {
  // Verificar si la asesoria ya está inicializada
  const asesoria = localStorage.getItem('asesoria');
  if (!asesoria) {
    // Crear asesoria por defecto
    const defaultAsesoria: Asesoria = {
      id: uuidv4(),
      nombre: 'Asesoría Fiscal & Contable S.L.',
      cif: 'B12345678',
      direccion: 'Calle Gran Vía 123, 28013 Madrid',
      telefono: '912345678',
      email: 'contacto@asesoriafiscal.es'
    };
    localStorage.setItem('asesoria', JSON.stringify(defaultAsesoria));
    
    // Inicializar colecciones vacías
    localStorage.setItem('clientes', JSON.stringify([]));
    localStorage.setItem('empleados', JSON.stringify([]));
    localStorage.setItem('empleadosCliente', JSON.stringify([]));
    localStorage.setItem('facturas', JSON.stringify([]));
    localStorage.setItem('documentos', JSON.stringify([]));
    localStorage.setItem('tareas', JSON.stringify([]));
    
    // Crear clientes de prueba
    const clientesPrueba = [
      {
        id: uuidv4(),
        asesoriaId: defaultAsesoria.id,
        nombre: 'Restaurante El Buen Sabor S.L.',
        nif: 'B87654321',
        direccion: 'Calle Serrano 45, 28001 Madrid',
        telefono: '911222333',
        email: 'info@elbuensabor.es',
        personaContacto: 'María López',
        periodicidadFiscal: 'Trimestral',
        modelosFiscales: '303, 390, 111',
        tipoImpuesto: 'General'
      },
      {
        id: uuidv4(),
        asesoriaId: defaultAsesoria.id,
        nombre: 'Talleres Mecánicos Rodríguez',
        nif: '12345678Z',
        direccion: 'Polígono Industrial Norte 23, 28760 Tres Cantos',
        telefono: '911333444',
        email: 'talleres@rodriguez.com',
        personaContacto: 'Antonio Rodríguez',
        periodicidadFiscal: 'Trimestral',
        modelosFiscales: '303, 100, 115',
        tipoImpuesto: 'Reducido'
      },
      {
        id: uuidv4(),
        asesoriaId: defaultAsesoria.id,
        nombre: 'Consultora Tecnológica Innova',
        nif: 'A12345678',
        direccion: 'Paseo de la Castellana 200, 28046 Madrid',
        telefono: '917654321',
        email: 'contacto@innova.tech',
        personaContacto: 'Carlos Gómez',
        periodicidadFiscal: 'Mensual',
        modelosFiscales: '303, 200, 115, 180',
        tipoImpuesto: 'General'
      }
    ];
    
    localStorage.setItem('clientes', JSON.stringify(clientesPrueba));
    
    // Crear servicios iniciales
    const serviciosIniciales: Servicio[] = [
      {
        id: uuidv4(),
        nombre: 'Asesoramiento Fiscal',
        descripcion: 'Servicio completo de asesoramiento fiscal para autónomos y empresas.',
        precio: 120.00,
        categoria: 'fiscal',
        imagen: '/services/fiscal.jpg'
      },
      {
        id: uuidv4(),
        nombre: 'Contabilidad Mensual',
        descripcion: 'Gestión contable mensual para empresas con registro de facturas y elaboración de libros contables.',
        precio: 150.00,
        categoria: 'contabilidad',
        imagen: '/services/contabilidad.jpg'
      },
      {
        id: uuidv4(),
        nombre: 'Nóminas y Seguridad Social',
        descripcion: 'Gestión de nóminas, seguros sociales y trámites con la Seguridad Social.',
        precio: 80.00,
        categoria: 'laboral',
        imagen: '/services/laboral.jpg'
      },
      {
        id: uuidv4(),
        nombre: 'Declaraciones Trimestrales',
        descripcion: 'Preparación y presentación de impuestos trimestrales (IVA, IRPF, etc.).',
        precio: 100.00,
        categoria: 'fiscal',
        imagen: '/services/impuestos.jpg'
      },
      {
        id: uuidv4(),
        nombre: 'Constitución de Sociedades',
        descripcion: 'Asesoramiento y gestión completa para la creación de nuevas empresas.',
        precio: 350.00,
        categoria: 'juridico',
        imagen: '/services/sociedades.jpg'
      },
      {
        id: uuidv4(),
        nombre: 'Consultoría Estratégica',
        descripcion: 'Análisis de negocio y consultoría para optimización fiscal y financiera.',
        precio: 200.00,
        categoria: 'consultoria',
        imagen: '/services/consultoria.jpg'
      }
    ];
    localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
    localStorage.setItem('carrito', JSON.stringify({ items: [], total: 0 }));
  }
};

// Funciones genéricas CRUD
export const getAll = <T>(key: string): T[] => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

export const getById = <T>(key: string, id: string): T | null => {
  const items = getAll<T>(key);
  return items.find((item: any) => item.id === id) || null;
};

export const save = <T>(key: string, item: T): T => {
  const items = getAll<T>(key);
  const newItem = { ...item, id: (item as any).id || uuidv4() };
  
  // Buscar si existe para actualizar o agregar nuevo
  const index = items.findIndex((i: any) => i.id === (item as any).id);
  
  if (index >= 0) {
    items[index] = newItem;
  } else {
    items.push(newItem);
  }
  
  localStorage.setItem(key, JSON.stringify(items));
  return newItem;
};

export const remove = <T>(key: string, id: string): boolean => {
  const items = getAll<T>(key);
  const filteredItems = items.filter((item: any) => item.id !== id);
  
  if (filteredItems.length === items.length) {
    return false;
  }
  
  localStorage.setItem(key, JSON.stringify(filteredItems));
  return true;
};

export const getAsesoria = (): Asesoria => {
  const asesoria = localStorage.getItem('asesoria');
  return asesoria ? JSON.parse(asesoria) : null;
};

export const updateAsesoria = (asesoria: Asesoria): Asesoria => {
  localStorage.setItem('asesoria', JSON.stringify(asesoria));
  return asesoria;
};

// Funciones específicas para el carrito
export const getCarrito = (): Carrito => {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : { items: [], total: 0 };
};

export const addToCarrito = (servicio: Servicio, cantidad: number): Carrito => {
  const carrito = getCarrito();
  const existingItemIndex = carrito.items.findIndex(item => item.servicioId === servicio.id);
  
  if (existingItemIndex >= 0) {
    carrito.items[existingItemIndex].cantidad += cantidad;
  } else {
    carrito.items.push({
      id: uuidv4(),
      servicioId: servicio.id,
      cantidad,
      precio: servicio.precio
    });
  }
  
  // Recalcular total
  carrito.total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
  return carrito;
};

export const updateCarritoItem = (itemId: string, cantidad: number): Carrito => {
  const carrito = getCarrito();
  const itemIndex = carrito.items.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (cantidad <= 0) {
      carrito.items.splice(itemIndex, 1);
    } else {
      carrito.items[itemIndex].cantidad = cantidad;
    }
    
    // Recalcular total
    carrito.total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  return carrito;
};

export const clearCarrito = (): Carrito => {
  const emptyCarrito: Carrito = { items: [], total: 0 };
  localStorage.setItem('carrito', JSON.stringify(emptyCarrito));
  return emptyCarrito;
};

// Funciones para datos relacionales
export const getClientesByAsesoriaId = (asesoriaId: string): Cliente[] => {
  const clientes = getAll<Cliente>('clientes');
  return clientes.filter(cliente => cliente.asesoriaId === asesoriaId);
};

export const getEmpleadosByAsesoriaId = (asesoriaId: string): Empleado[] => {
  const empleados = getAll<Empleado>('empleados');
  return empleados.filter(empleado => empleado.asesoriaId === asesoriaId);
};

export const getFacturasByClienteId = (clienteId: string): Factura[] => {
  const facturas = getAll<Factura>('facturas');
  return facturas.filter(factura => factura.clienteId === clienteId);
};

export const getDocumentosByClienteId = (clienteId: string): Documento[] => {
  const documentos = getAll<Documento>('documentos');
  return documentos.filter(documento => documento.clienteId === clienteId);
};

export const getTareasByClienteId = (clienteId: string): Tarea[] => {
  const tareas = getAll<Tarea>('tareas');
  return tareas.filter(tarea => tarea.clienteId === clienteId);
};

export const getEmpleadosClienteByClienteId = (clienteId: string): EmpleadoCliente[] => {
  const empleadosCliente = getAll<EmpleadoCliente>('empleadosCliente');
  return empleadosCliente.filter(empleado => empleado.clienteId === clienteId);
};
