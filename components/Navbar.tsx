import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { View } from "../types";

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (view: View) => {
    // Sync view with URL
    const viewPaths: Record<View, string> = {
      [View.HOME]: '/',
      [View.LOST_PETS]: '/lost-pets',
      [View.ADOPTION]: '/adoption',
      [View.DONATIONS]: '/donations',
      [View.FAQ]: '/faq',
      [View.ABOUT_US]: '/about-us',
    };
    
    // Only navigate if URL is different (to avoid infinite loops)
    if (location.pathname !== viewPaths[view]) {
      navigate(viewPaths[view]);
    }
    setView(view);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#203553] backdrop-blur-md border-b border-[#ecdbbd]/30 px-4 md:px-10 lg:px-20 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <button
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigation(View.HOME)}
          >
            <img
              src="/pwa-512x512.png"
              alt="LyM Desarrollo Web"
              className="h-14 w-auto"
            />
            <h2 className="mb-0 text-lg font-bold tracking-tight text-[#ecdbbd]">
              Mascotas SJ
            </h2>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => handleNavigation(View.HOME)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.HOME ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavigation(View.LOST_PETS)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.LOST_PETS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Mascotas perdidas
            </button>
            <button
              onClick={() => handleNavigation(View.ADOPTION)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.ADOPTION ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Adopciones
            </button>
            <button
              onClick={() => handleNavigation(View.DONATIONS)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.DONATIONS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Donaciones
            </button>
            <button
              onClick={() => handleNavigation(View.FAQ)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.FAQ ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Preguntas
            </button>
            <button
              onClick={() => handleNavigation(View.ABOUT_US)}
              className={`lg:text-base font-semibold transition-colors cursor-pointer hover:scale-105 ${currentView === View.ABOUT_US ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Nosotros
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/login"
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold rounded-lg bg-[#ecdbbd] text-[#203553] hover:bg-[#203553] hover:text-[#ecdbbd] hover:border-2 hover:border-[#ecdbbd] transition-colors"
          >
            Ingresar
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold rounded-lg border-2 border-[#ecdbbd] text-[#ecdbbd] hover:bg-[#ecdbbd] hover:text-[#203553] transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
