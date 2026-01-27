
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import LostPets from './views/LostPets';
import Adoption from './views/Adoption';
import AIPetAssistant from './views/AIPetAssistant';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <Home />;
      case View.LOST_PETS: return <LostPets />;
      case View.ADOPTION: return <Adoption />;
      case View.AI_ASSISTANT: return <AIPetAssistant />;
      case View.DONATIONS: return (
        <div className="flex items-center justify-center min-h-[60vh] text-center p-10">
          <div className="max-w-md">
            <span className="material-symbols-outlined text-7xl text-primary mb-6 animate-pulse">volunteer_activism</span>
            <h2 className="text-3xl font-black mb-4">Donaciones y Solidaridad</h2>
            <p className="text-accent-teal leading-relaxed">Estamos terminando de configurar la plataforma de pagos seguros. ¡Vuelve pronto para ayudar a nuestros amigos!</p>
            <button onClick={() => setCurrentView(View.HOME)} className="mt-8 bg-primary text-background-dark px-10 py-4 rounded-2xl font-black shadow-lg">VOLVER AL INICIO</button>
          </div>
        </div>
      );
      default: return <Home />;
    }
  };

  return (
    <div className="layout-container flex flex-col min-h-screen selection:bg-primary selection:text-background-dark">
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-20 py-8">
        {renderView()}
      </main>

      <footer className="border-t border-accent-teal/10 py-12 px-6 lg:px-20 mt-auto bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-lg text-white">
              <span className="material-symbols-outlined block text-2xl">pets</span>
            </div>
            <div>
              <h2 className="text-xl font-black">PetWelfare</h2>
              <p className="text-xs text-accent-teal font-medium tracking-tight">Comunidad de Bienestar Animal © 2024</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-bold text-accent-teal">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
            <a href="#" className="hover:text-primary transition-colors">Contacto</a>
          </nav>

          <div className="flex gap-4">
            {['public', 'share', 'forum'].map(icon => (
              <button key={icon} className="size-10 rounded-xl bg-accent-teal/10 flex items-center justify-center hover:bg-primary transition-all">
                <span className="material-symbols-outlined text-lg">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden sticky bottom-0 z-50 bg-background-light dark:bg-background-dark border-t border-accent-teal/10 flex items-center justify-around py-4 px-2 backdrop-blur-md">
        <button onClick={() => setCurrentView(View.HOME)} className={`flex flex-col items-center gap-1 ${currentView === View.HOME ? 'text-primary' : 'text-accent-teal/60'}`}>
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inicio</span>
        </button>
        <button onClick={() => setCurrentView(View.LOST_PETS)} className={`flex flex-col items-center gap-1 ${currentView === View.LOST_PETS ? 'text-primary' : 'text-accent-teal/60'}`}>
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Mascotas</span>
        </button>
        <button className="flex flex-col items-center justify-center -mt-10 bg-primary text-background-dark size-14 rounded-full shadow-2xl border-4 border-white dark:border-background-dark active:scale-90 transition-transform">
          <span className="material-symbols-outlined font-bold text-3xl">add</span>
        </button>
        <button onClick={() => setCurrentView(View.DONATIONS)} className={`flex flex-col items-center gap-1 ${currentView === View.DONATIONS ? 'text-primary' : 'text-accent-teal/60'}`}>
          <span className="material-symbols-outlined">volunteer_activism</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Donar</span>
        </button>
        <button onClick={() => setCurrentView(View.AI_ASSISTANT)} className={`flex flex-col items-center gap-1 ${currentView === View.AI_ASSISTANT ? 'text-primary' : 'text-accent-teal/60'}`}>
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">AI</span>
        </button>
      </div>
    </div>
  );
};

export default App;
