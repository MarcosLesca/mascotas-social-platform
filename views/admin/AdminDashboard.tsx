import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const email = user?.email ?? '';

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Panel de administración</h1>
            <p className="text-accent-teal font-medium mt-1">
              Conectado como <span className="text-primary font-bold">{email}</span>
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal font-bold hover:bg-accent-teal/20 dark:hover:bg-accent-teal/30 transition-colors"
          >
            Ir al sitio
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/lost-pets"
            className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all block"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mascotas perdidas</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Revisa, aprueba o rechaza reportes. Solo los aprobados se publican.
            </p>
            <span className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-2">
              Ir →
            </span>
          </Link>
          <Link
            to="/admin/adoption"
            className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all block"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AdopciÃ³n</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Publicaciones de adopciÃ³n. AprobÃ¡ o rechazÃ¡ antes de publicar.
            </p>
            <span className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-2">
              Ir →
            </span>
          </Link>
          <Link
            to="/admin/donations"
            className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all block"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Donaciones</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Campañas y donaciones. Próximamente con Supabase.
            </p>
            <span className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-2">
              Ir â†’
            </span>
          </Link>
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Usuarios</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Usuarios y permisos. Próximamente con Supabase.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-accent-teal/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mascotas SJ Admin · Supabase Auth
          </p>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 text-urgent-red font-bold hover:bg-urgent-red/20 dark:hover:bg-urgent-red/30 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
