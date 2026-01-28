import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import LostPets from './views/LostPets';
import Adoption from './views/Adoption';
import AIPetAssistant from './views/AIPetAssistant';
import FAQSection from './components/FAQSection';
import ToastContainer from './components/Toast';
import { AppProvider, useApp } from './context/AppContext';
import { View } from './types';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toasts, removeToast, addToast } = useApp();

  // Initialize animations on mount
  useEffect(() => {
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.stagger-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, [currentView]); // Re-run when view changes

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <Home onToast={addToast} />;
      case View.LOST_PETS: return <LostPets onToast={addToast} />;
      case View.ADOPTION: return <Adoption onToast={addToast} />;
      case View.AI_ASSISTANT: return <AIPetAssistant onToast={addToast} />;
      case View.FAQ: return <FAQSection />;
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
      
      <main className="flex-1">
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
            <button onClick={() => setCurrentView(View.FAQ)} className="hover:text-primary transition-colors">Preguntas Frecuentes</button>
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
            <a href="#" className="hover:text-primary transition-colors">Contacto</a>
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
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
        <button 
          onClick={() => setCurrentView(View.HOME)} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.HOME ? 'text-primary' : 'text-accent-teal/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inicio</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.LOST_PETS)} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.LOST_PETS ? 'text-primary' : 'text-accent-teal/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Mascotas</span>
        </button>
        <button 
          onClick={() => {
            addToast('Función de reporte próximamente', 'info');
          }}
          className="flex flex-col items-center justify-center -mt-10 bg-primary text-background-dark size-14 rounded-full shadow-2xl border-4 border-white dark:border-background-dark active:scale-90 transition-transform hover:scale-[1.05]"
        >
          <span className="material-symbols-outlined font-bold text-3xl">add</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.FAQ)} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.FAQ ? 'text-primary' : 'text-accent-teal/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Ayuda</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.AI_ASSISTANT)} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.AI_ASSISTANT ? 'text-primary' : 'text-accent-teal/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">AI</span>
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
