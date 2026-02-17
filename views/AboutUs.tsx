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
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Logo de LyM */}
          <div className="flex-shrink-0">
            <img
              src="/assets/LyM-logo.png"
              alt="LyM Desarrollo Web"
              className="w-20 h-20"
            />
          </div>

          <div className="text-center">
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
        <div className="bg-[#203553] p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-[#ecdbbd] mb-4">
            Nuestra identidad
          </h2>
          <p className="text-white/80 leading-relaxed">
            Somos Loana y Marcos (L&M Studio), un equipo de desarrollo de San
            Justo, Santa Fe, enfocado en crear soluciones digitales que combinan
            diseño, tecnología y rendimiento.
          </p>
        </div>

        {/* Qué hacemos */}
        <div className="bg-[#203553] p-8 rounded-3xl">
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

      {/* Contacto y Mejoras */}
      <div className="mt-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#203553] mb-4">
            Tu opinión mejora Mascotas SJ
          </h2>
          <p className="text-lg text-[#203553] leading-relaxed mb-6 max-w-2xl mx-auto">
            Si encontrás algún error en la plataforma o creés que podemos
            mejorar algo, podés comunicarte con nosotros a través de nuestro
            sitio web. Valoramos cada aporte para seguir mejorando la
            experiencia de la comunidad en San Justo, Santa Fe.
          </p>
          <a
            href="https://wa.me/543498418583"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.92.5 3.8 1.45 5.45L2 22l4.82-1.56a9.83 9.83 0 0 0 5.22 1.5h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2zm5.73 14.16c-.24.67-1.18 1.29-1.97 1.46-.54.11-1.24.2-3.6-.78-3.02-1.25-4.97-4.32-5.12-4.52-.14-.2-1.23-1.64-1.23-3.14 0-1.5.78-2.24 1.06-2.54.28-.3.61-.38.81-.38h.58c.18 0 .43-.07.67.51.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.32.38-.46.51-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.2-.3.41-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.34.07.12.07.69-.17 1.36z"></path>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
