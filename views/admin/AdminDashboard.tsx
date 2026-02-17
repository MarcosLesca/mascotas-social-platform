import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Colores de marca
const COLORS = {
  bg: '#203553',
  bgLight: '#2a4266',
  text: '#ecdbbd',
  muted: '#8b9cb3',
};

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const email = user?.email ?? '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="p-4 md:p-6 lg:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black" style={{ color: COLORS.bg }}>
                Panel de administracion
              </h1>
              <p className="text-sm font-medium mt-1" style={{ color: COLORS.bgLight }}>
                Conectado como <span style={{ fontWeight: 700, color: COLORS.bg }}>{email}</span>
              </p>
            </div>
            <Link
              to="/"
              type="button"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
              style={{ 
                backgroundColor: `${COLORS.bg}15`, 
                color: COLORS.bg 
              }}
            >
              Ir al sitio
            </Link>
          </div>

          {/* Menu de secciones */}
          <div className="grid gap-4">
            <Link
              to="/admin/lost-pets"
              className="flex items-center justify-between p-5 rounded-xl border shadow-sm hover:shadow-md transition-all"
              style={{ 
                backgroundColor: 'white', 
                borderColor: `${COLORS.bg}15` 
              }}
            >
              <div>
                <h2 className="font-bold text-base" style={{ color: COLORS.bg }}>
                  Mascotas Perdidas
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                  Revisa y aprueba reportes de mascotas perdidas
                </p>
              </div>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.bg }}
              >
                <span className="font-bold text-sm" style={{ color: COLORS.text }}>
                  1
                </span>
              </div>
            </Link>

            <Link
              to="/admin/adoption"
              className="flex items-center justify-between p-5 rounded-xl border shadow-sm hover:shadow-md transition-all"
              style={{ 
                backgroundColor: 'white', 
                borderColor: `${COLORS.bg}15` 
              }}
            >
              <div>
                <h2 className="font-bold text-base" style={{ color: COLORS.bg }}>
                  Adopcion
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                  Publicaciones de adopcion pendientes
                </p>
              </div>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.bg }}
              >
                <span className="font-bold text-sm" style={{ color: COLORS.text }}>
                  2
                </span>
              </div>
            </Link>

            <Link
              to="/admin/donations"
              className="flex items-center justify-between p-5 rounded-xl border shadow-sm hover:shadow-md transition-all"
              style={{ 
                backgroundColor: 'white', 
                borderColor: `${COLORS.bg}15` 
              }}
            >
              <div>
                <h2 className="font-bold text-base" style={{ color: COLORS.bg }}>
                  Donaciones
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                  Campanas de donacion pendientes
                </p>
              </div>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.bg }}
              >
                <span className="font-bold text-sm" style={{ color: COLORS.text }}>
                  3
                </span>
              </div>
            </Link>

            <div 
              className="flex items-center justify-between p-5 rounded-xl border shadow-sm opacity-50"
              style={{ 
                backgroundColor: 'white', 
                borderColor: `${COLORS.bg}15` 
              }}
            >
              <div>
                <h2 className="font-bold text-base" style={{ color: COLORS.bg }}>
                  Usuarios
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                  Gestion de usuarios y permisos
                </p>
              </div>
              <span 
                className="text-xs font-medium px-2 py-1 rounded"
                style={{ backgroundColor: `${COLORS.bg}10`, color: COLORS.bg }}
              >
                Proximamente
              </span>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4"
            style={{ borderColor: `${COLORS.bg}15` }}
          >
            <p className="text-sm" style={{ color: COLORS.muted }}>
              Mascotas SJ Admin
            </p>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
              style={{ 
                backgroundColor: '#dc262610', 
                color: '#dc2626' 
              }}
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
