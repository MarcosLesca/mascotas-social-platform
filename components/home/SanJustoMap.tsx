"use client";

import { useEffect, useRef } from "react";

const SanJustoMap: React.FC = () => {
  const mapFrameRef = useRef<HTMLIFrameElement>(null);

  // Coordenadas de San Justo, Santa Fe, Argentina
  const lat = -30.7872;
  const lng = -60.5838;

  // URL del mapa OpenStreetMap centrada en San Justo
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`;

  useEffect(() => {
    // Actualizar el iframe cuando cargue
    if (mapFrameRef.current) {
      mapFrameRef.current.src = mapUrl;
    }
  }, [mapUrl]);

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Encabezado de la sección */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            📍 Estamos en San Justo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Santa Fe, Argentina. Una comunidad dedicada al bienestar animal.
          </p>
        </div>

        {/* Contenedor del mapa */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full">
            <iframe
              ref={mapFrameRef}
              src={mapUrl}
              title="Mapa de San Justo, Santa Fe"
              className="w-full h-full border-0"
              allowFullCell
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ minHeight: "400px" }}
            />
          </div>
          
          {/* Badge de ubicación */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-bold text-gray-700">
              🗺️ San Justo, Santa Fe
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="https://www.openstreetmap.org/#map=14/-30.7872/-60.5838"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            <span>🖱️</span>
            Ver en OpenStreetMap
          </a>
          <a
            href="https://www.google.com/maps/search/veterinarias+san+justo+santa+fe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-teal text-white rounded-full font-bold text-sm hover:bg-accent-teal/90 transition-colors"
          >
            <span>🏥</span>
            Veterinarias Cercanas
          </a>
        </div>
      </div>
    </section>
  );
};

export default SanJustoMap;
