import React from "react";
import { View } from "../types";

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 bg-accent-teal dark:bg-accent-teal backdrop-blur-md border-b border-accent-teal/20 px-4 md:px-10 lg:px-20 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <button
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView(View.HOME)}
          >
            <img 
              src="https://lymdesarrolloweb.com.ar/assets/img/MyL.png" 
              alt="LyM Desarrollo Web" 
              className="h-10 w-auto"
            />
            <h2 className="text-lg font-bold tracking-tight text-white">Mascotas SJ</h2>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setView(View.HOME)}
              className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? "text-white" : "hover:text-white"}`}
            >
              Inicio
            </button>
            <button
              onClick={() => setView(View.LOST_PETS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.LOST_PETS ? "text-white" : "hover:text-white"}`}
            >
              Mascotas Perdidas
            </button>
            <button
              onClick={() => setView(View.ADOPTION)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ADOPTION ? "text-white" : "hover:text-white"}`}
            >
              Adopción
            </button>
            <button
              onClick={() => setView(View.DONATIONS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.DONATIONS ? "text-white" : "hover:text-white"}`}
            >
              Donaciones
            </button>
            <button
              onClick={() => setView(View.FAQ)}
              className={`text-sm font-semibold transition-colors ${currentView === View.FAQ ? "text-white" : "hover:text-white"}`}
            >
              Preguntas
            </button>
            <button
              onClick={() => setView(View.ABOUT_US)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ABOUT_US ? "text-white" : "hover:text-white"}`}
            >
              Nosotros
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
            Reportar Mascota
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
