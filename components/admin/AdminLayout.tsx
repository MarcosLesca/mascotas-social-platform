import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Colores de marca
const COLORS = {
  bg: '#203553',
  bgLight: '#2a4266',
  text: '#ecdbbd',
  muted: '#8b9cb3',
};

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const email = user?.email ?? "";
  const initial = email.slice(0, 1).toUpperCase();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f6f2' }}>
      <header 
        className="sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3"
        style={{ 
          backgroundColor: COLORS.bg, 
          borderColor: `${COLORS.text}30` 
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-3">
              <span className="font-bold text-sm" style={{ color: COLORS.text }}>
                Admin Mascotas SJ
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  color: isActive('/admin') && location.pathname === '/admin' 
                    ? COLORS.text 
                    : `${COLORS.text}70`,
                  backgroundColor: isActive('/admin') && location.pathname === '/admin' 
                    ? `${COLORS.text}20` 
                    : 'transparent'
                }}
              >
                Panel
              </Link>
              <Link
                to="/admin/lost-pets"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  color: isActive('/admin/lost-pets') 
                    ? COLORS.text 
                    : `${COLORS.text}70`,
                  backgroundColor: isActive('/admin/lost-pets') 
                    ? `${COLORS.text}20` 
                    : 'transparent'
                }}
              >
                Perdidas
              </Link>
              <Link
                to="/admin/adoption"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  color: isActive('/admin/adoption') 
                    ? COLORS.text 
                    : `${COLORS.text}70`,
                  backgroundColor: isActive('/admin/adoption') 
                    ? `${COLORS.text}20` 
                    : 'transparent'
                }}
              >
                Adopcion
              </Link>
              <Link
                to="/admin/donations"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  color: isActive('/admin/donations') 
                    ? COLORS.text 
                    : `${COLORS.text}70`,
                  backgroundColor: isActive('/admin/donations') 
                    ? `${COLORS.text}20` 
                    : 'transparent'
                }}
              >
                Donaciones
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium truncate max-w-[180px]" style={{ color: `${COLORS.text}70` }}>
              {email}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ 
                backgroundColor: COLORS.text, 
                color: COLORS.bg 
              }}
              title={email}
            >
              {initial}
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              style={{ 
                color: `${COLORS.text}70`,
              }}
              title="Cerrar sesion"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
