import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import LostPets from "./views/LostPets";
import Adoption from "./views/Adoption";
import AboutUs from "./views/AboutUs";
import Donations from "./views/Donations";
import FAQSection from "./components/FAQSection";
import ToastContainer from "./components/Toast";
import SanJustoMap from "./components/home/SanJustoMap";
import { AppProvider, useApp } from "./context/AppContext";
import { View } from "./types";

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toasts, removeToast, addToast } =
    useApp();

  // Initialize animations on mount
  useEffect(() => {
    // Add stagger animation to cards
    const cards = document.querySelectorAll(".stagger-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [currentView]); // Re-run when view changes

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home onToast={addToast} />;
      case View.LOST_PETS:
        return <LostPets onToast={addToast} />;
      case View.ADOPTION:
        return <Adoption onToast={addToast} />;
      case View.ABOUT_US:
        return <AboutUs />;
      case View.FAQ:
        return <FAQSection />;
      case View.DONATIONS:
        return <Donations />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="layout-container flex flex-col min-h-screen selection:bg-primary selection:text-background-dark">
      <Navbar currentView={currentView} setView={setCurrentView} />

      <main className="flex-1">{renderView()}</main>

      {currentView === View.HOME && (
        <section className="px-4 md:px-10 lg:px-20 py-8">
          <div className="max-w-[1440px] mx-auto">
            <SanJustoMap />
          </div>
        </section>
      )}

      <footer className="border-t border-white/20 py-8 px-6 lg:px-20 mt-auto bg-accent-teal">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <img 
              src="https://lymdesarrolloweb.com.ar/assets/img/MyL.png" 
              alt="LyM Desarrollo Web" 
              className="h-8 w-auto"
            />
            <span className="text-lg font-black text-white">Mascotas SJ</span>
          </div>
          <a 
            href="https://lymdesarrolloweb.com.ar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-bold text-[#203553] hover:text-[#203553]/80 hover:underline transition-colors"
          >
            © 2026 LyM Desarrollo Web. Todos los derechos reservados.
          </a>
          <Link to="/admin" className="text-sm font-bold text-white hover:text-white/80 transition-colors">
            Admin
          </Link>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden sticky bottom-0 z-50 bg-background-light dark:bg-background-dark border-t border-accent-teal/10 flex items-center justify-around py-4 px-2 backdrop-blur-md">
        <button
          onClick={() => setCurrentView(View.HOME)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.HOME
              ? "text-primary"
              : "text-accent-teal/60 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Inicio
          </span>
        </button>
        <button
          onClick={() => setCurrentView(View.LOST_PETS)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.LOST_PETS
              ? "text-primary"
              : "text-accent-teal/60 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Mascotas
          </span>
        </button>
        <button
          onClick={() => {
            addToast("Función de reporte próximamente", "info");
          }}
          className="flex flex-col items-center justify-center -mt-10 bg-primary text-background-dark size-14 rounded-full shadow-2xl border-4 border-white dark:border-background-dark active:scale-90 transition-transform hover:scale-[1.05]"
        >
          <span className="material-symbols-outlined font-bold text-3xl">
            add
          </span>
        </button>
        <button
          onClick={() => setCurrentView(View.FAQ)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.FAQ
              ? "text-primary"
              : "text-accent-teal/60 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Ayuda
          </span>
        </button>
        <button
          onClick={() => setCurrentView(View.ABOUT_US)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.ABOUT_US
              ? "text-primary"
              : "text-accent-teal/60 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined">info</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Nosotros
          </span>
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
