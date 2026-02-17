import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#203553]">
          Sobre nosotros
        </h1>
      </div>

      {/* Desarrollado por LyM - PRIMERO */}
      <div className="mb-12 text-center">
        <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-white/5 rounded-3xl p-8 border-2 border-[#ecdbbd]/50 shadow-lg">
          {/* Logo de LyM */}
          <div className="flex-shrink-0">
            <img
              src="/assets/LyM-logo.png"
              alt="LyM Desarrollo Web"
              className="w-20 h-20 mx-auto"
            />
          </div>

          <div className="text-left">
            <p className="text-lg text-[#203553] font-semibold mb-2">
              Esta plataforma fue desarrollada por
            </p>
            <a
              href="https://lymdesarrolloweb.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-[#273f56] hover:text-[#898e8d] transition-colors underline underline-offset-4"
            >
              LyM Desarrollo Web
            </a>
            <p className="text-black mt-2 font-bold">
              ¿Necesitás una página web? Visitanos.
            </p>
          </div>

          <a
            href="https://lymdesarrolloweb.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#273f56] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#203553] transition-colors"
          >
            Visitar web
          </a>
        </div>
      </div>

      {/* Nuestra Identidad y Qué Hacemos */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Nuestra Identidad */}
        <div className="bg-[#203553]/90 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-[#ecdbbd] mb-4">
              Nuestra identidad
            </h2>
            <p className="text-white/80 leading-relaxed">
              Somos Loana y Marcos (L&M Studio), un equipo de desarrollo de San
              Justo, Santa Fe, enfocado en crear soluciones digitales que
              combinan diseño, tecnología y rendimiento.
            </p>
          </div>
        </div>

        {/* Qué hacemos */}
        <div className="bg-[#203553]/90 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-[#ecdbbd] mb-4">
              ¿Qué hacemos?
            </h2>
            <p className="text-white/80 leading-relaxed">
              Trabajamos de forma remota con comunicación clara y organización
              simple. Nos capacitamos constantemente para ofrecer soluciones
              modernas, rápidas y bien diseñadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
