import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
              src="/assets/LyM-logo.png"
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
              className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavigation(View.LOST_PETS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.LOST_PETS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Mascotas perdidas
            </button>
            <button
              onClick={() => handleNavigation(View.ADOPTION)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ADOPTION ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Adopciones
            </button>
            <button
              onClick={() => handleNavigation(View.DONATIONS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.DONATIONS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Donaciones
            </button>
            <button
              onClick={() => handleNavigation(View.FAQ)}
              className={`text-sm font-semibold transition-colors ${currentView === View.FAQ ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Preguntas
            </button>
            <button
              onClick={() => handleNavigation(View.ABOUT_US)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ABOUT_US ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Nosotros
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-[#ecdbbd] hover:bg-[#ecdbbd]/90 text-[#203553] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
            Reportar mascota
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
