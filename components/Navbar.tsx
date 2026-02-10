
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-accent-teal/10 px-4 md:px-10 lg:px-20 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <button 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView(View.HOME)}
          >
            <h2 className="text-lg font-bold tracking-tight">PetWelfare</h2>
          </button>
          
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => setView(View.HOME)}
              className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? 'text-primary' : 'hover:text-primary'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setView(View.LOST_PETS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.LOST_PETS ? 'text-primary' : 'hover:text-primary'}`}
            >
              Mascotas Perdidas
            </button>
            <button 
              onClick={() => setView(View.ADOPTION)}
              className={`text-sm font-semibold transition-colors ${currentView === View.ADOPTION ? 'text-primary' : 'hover:text-primary'}`}
            >
              Adopción
            </button>
            <button 
              onClick={() => setView(View.DONATIONS)}
              className={`text-sm font-semibold transition-colors ${currentView === View.DONATIONS ? 'text-primary' : 'hover:text-primary'}`}
            >
              Donaciones
            </button>
            <button 
              onClick={() => setView(View.FAQ)}
              className={`text-sm font-semibold transition-colors ${currentView === View.FAQ ? 'text-primary' : 'hover:text-primary'}`}
            >
              Preguntas
            </button>
            <button 
              onClick={() => setView(View.AI_ASSISTANT)}
              className={`text-sm font-semibold transition-colors ${currentView === View.AI_ASSISTANT ? 'text-primary' : 'hover:text-primary'}`}
            >
              Asistente AI
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
            Reportar Mascota
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
