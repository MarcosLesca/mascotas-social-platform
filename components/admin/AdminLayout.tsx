import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const email = user?.email ?? '';
  const initial = email.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-accent-teal/10 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-background-dark">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white">Admin PetWelfare</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-accent-teal hover:bg-accent-teal/10 transition-colors"
              >
                Panel
              </Link>
              <Link
                to="/admin/lost-pets"
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-accent-teal hover:bg-accent-teal/10 transition-colors"
              >
                Mascotas perdidas
              </Link>
              <Link
                to="/admin/adoption"
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-accent-teal hover:bg-accent-teal/10 transition-colors"
              >
                AdopciÃ³n
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium text-accent-teal truncate max-w-[180px]">
              {email}
            </span>
            <div
              className="size-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center"
              title={email}
            >
              {initial}
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl text-slate-500 hover:bg-urgent-red/10 hover:text-urgent-red transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
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
