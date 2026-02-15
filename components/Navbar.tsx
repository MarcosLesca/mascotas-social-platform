import React from "react";
import { View } from "../types";

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#203553] backdrop-blur-md border-b border-[#ecdbbd]/30 px-4 md:px-10 lg:px-20 py-3">
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
            <h2 className="mb-0 text-lg font-bold tracking-tight text-[#ecdbbd]">Mascotas SJ</h2>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setView(View.HOME)}
              className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Inicio
            </button>
            <button
              onClick={() => setView(View.LOST_PETS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.LOST_PETS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Mascotas Perdidas
            </button>
            <button
              onClick={() => setView(View.ADOPTION)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ADOPTION ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Adopción
            </button>
            <button
              onClick={() => setView(View.DONATIONS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.DONATIONS ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Donaciones
            </button>
            <button
              onClick={() => setView(View.FAQ)}
              className={`text-sm font-semibold transition-colors ${currentView === View.FAQ ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Preguntas
            </button>
            <button
              onClick={() => setView(View.ABOUT_US)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ABOUT_US ? "text-[#ecdbbd]" : "text-[#ecdbbd]/80 hover:text-[#ecdbbd]"}`}
            >
              Nosotros
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-[#ecdbbd] hover:bg-[#ecdbbd]/90 text-[#203553] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
            Reportar Mascota
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
