
import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Home, Users, FileText, Calendar, List, 
  File, Settings, LogOut, Menu, X, 
  Activity, User, BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: User, label: 'Empleados', path: '/admin/empleados' },
    { icon: FileText, label: 'Facturas', path: '/admin/facturas' },
    { icon: File, label: 'Documentos', path: '/admin/documentos' },
    { icon: List, label: 'Tareas', path: '/admin/tareas' },
    { icon: Calendar, label: 'Calendario', path: '/admin/calendario' },
    { icon: Activity, label: 'Actividad', path: '/admin/actividad' },
    { icon: BarChart, label: 'Informes', path: '/admin/informes' },
    { icon: Settings, label: 'Configuración', path: '/admin/configuracion' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className={`bg-primary text-white hidden md:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className={`h-16 flex items-center justify-between p-2 ${sidebarOpen ? 'px-6' : 'px-2'}`}>
          {sidebarOpen ? (
            <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
          ) : (
            <Link to="/admin" className="text-xl font-bold mx-auto">AD</Link>
          )}
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="mt-4 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md hover:bg-white/10 transition-colors ${
                      location.pathname === item.path ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center text-white"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white z-50">
        <div className="flex justify-between items-center p-4">
          <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-2 rounded-md hover:bg-white/10 transition-colors ${
                        location.pathname === item.path ? 'bg-white/20' : ''
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-start text-white"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:ml-0 md:pt-0 pt-16"> {/* Added padding top for mobile */}
          <div className="p-6 overflow-y-auto h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
