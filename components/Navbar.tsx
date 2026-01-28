
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
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView(View.HOME)}
          >
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <span className="material-symbols-outlined block">pets</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">PetWelfare</h2>
          </div>
          
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
              className={`text-sm font-semibold transition-colors ${currentView === View.FAQ ? 'text-primary' : 'hover:text-primary'} flex items-center gap-1`}
            >
              <span className="material-symbols-outlined text-sm">help</span>
              Preguntas
            </button>
            <button 
              onClick={() => setView(View.AI_ASSISTANT)}
              className={`text-sm font-semibold transition-colors ${currentView === View.AI_ASSISTANT ? 'text-primary' : 'hover:text-primary'} flex items-center gap-1`}
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              Asistente AI
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
            Reportar Mascota
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-accent-teal/5 dark:bg-white/5 hover:bg-accent-teal/10 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden bg-slate-200">
              <img src="https://picsum.photos/id/64/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
