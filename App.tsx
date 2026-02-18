import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to navigate and set view
  const handleNavigation = (view: View) => {
    const viewPaths: Record<View, string> = {
      [View.HOME]: "/",
      [View.LOST_PETS]: "/lost-pets",
      [View.ADOPTION]: "/adoption",
      [View.DONATIONS]: "/donations",
      [View.FAQ]: "/faq",
      [View.ABOUT_US]: "/about-us",
    };
    if (location.pathname !== viewPaths[view]) {
      navigate(viewPaths[view]);
    }
    setCurrentView(view);
  };

  // Sync view with URL when location changes (for back/forward navigation)
  useEffect(() => {
    const pathToView: Record<string, View> = {
      "/": View.HOME,
      "/lost-pets": View.LOST_PETS,
      "/adoption": View.ADOPTION,
      "/donations": View.DONATIONS,
      "/faq": View.FAQ,
      "/about-us": View.ABOUT_US,
    };

    const newView = pathToView[location.pathname];
    if (newView && newView !== currentView) {
      setCurrentView(newView);
    }
  }, [location.pathname, setCurrentView]);

  // Scroll to top when view changes (mobile only)
  useEffect(() => {
    if (window.innerWidth < 640) {
      setTimeout(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
    // Intentionally only depends on currentView
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

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

    for (const card of cards) {
      observer.observe(card);
    }

    return () => {
      for (const card of cards) {
        observer.unobserve(card);
      }
    };
  }, []);

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
        return <Donations onToast={addToast} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="layout-container flex flex-col min-h-screen">
      <Navbar currentView={currentView} setView={setCurrentView} />

      <main className="flex-1">{renderView()}</main>

      {currentView === View.HOME && (
        <section className="px-4 md:px-10 lg:px-20 py-8">
          <div className="max-w-[1440px] mx-auto">
            <SanJustoMap />
          </div>
        </section>
      )}

      <footer className="border-t border-[#ecdbbd]/30 py-8 px-6 lg:px-20 mt-auto bg-[#203553]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-8">
          <div className="flex items-center gap-2">
            <img
              src="/assets/LyM-logo.png"
              alt="LyM Desarrollo Web"
              className="h-12 w-auto"
            />
            <span className="text-lg font-black text-[#ecdbbd]">
              Mascotas SJ
            </span>
          </div>
          <a
            href="https://lymdesarrolloweb.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-center text-[#ecdbbd] hover:text-[#ecdbbd]/80 hover:underline transition-colors"
          >
            © 2026 LyM Desarrollo Web. Todos los derechos reservados.
          </a>
          <Link
            to="/admin"
            className="text-sm font-bold text-[#ecdbbd] hover:text-[#ecdbbd]/80 transition-colors"
          >
            Admin
          </Link>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden sticky bottom-0 z-50 bg-[#203553] border-t border-[#ecdbbd]/30 flex items-center justify-around py-4 px-2 backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleNavigation(View.HOME)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.HOME
              ? "text-[#ecdbbd]"
              : "text-[#ecdbbd]/60 hover:text-[#ecdbbd]"
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Inicio
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation(View.LOST_PETS)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.LOST_PETS
              ? "text-[#ecdbbd]"
              : "text-[#ecdbbd]/60 hover:text-[#ecdbbd]"
          }`}
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Mascotas
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation(View.ADOPTION)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.ADOPTION
              ? "text-[#ecdbbd]"
              : "text-[#ecdbbd]/60 hover:text-[#ecdbbd]"
          }`}
        >
          <span className="material-symbols-outlined">pets</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Adoptar
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation(View.DONATIONS)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === View.DONATIONS
              ? "text-[#ecdbbd]"
              : "text-[#ecdbbd]/60 hover:text-[#ecdbbd]"
          }`}
        >
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Donar
          </span>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === View.FAQ || currentView === View.ABOUT_US
                ? "text-[#ecdbbd]"
                : "text-[#ecdbbd]/60 hover:text-[#ecdbbd]"
            }`}
          >
            <span className="material-symbols-outlined">menu</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Más
            </span>
          </button>
          {showMoreMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#203553] border border-[#ecdbbd]/30 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
              <button
                type="button"
                onClick={() => {
                  handleNavigation(View.FAQ);
                  setShowMoreMenu(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors flex items-center gap-2 ${
                  currentView === View.FAQ
                    ? "text-[#ecdbbd] bg-[#ecdbbd]/10"
                    : "text-[#ecdbbd]/80 hover:text-[#ecdbbd] hover:bg-[#ecdbbd]/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Preguntas frecuentes
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNavigation(View.ABOUT_US);
                  setShowMoreMenu(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors flex items-center gap-2 ${
                  currentView === View.ABOUT_US
                    ? "text-[#ecdbbd] bg-[#ecdbbd]/10"
                    : "text-[#ecdbbd]/80 hover:text-[#ecdbbd] hover:bg-[#ecdbbd]/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">info</span>
                Sobre nosotros
              </button>
            </div>
          )}
        </div>
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
