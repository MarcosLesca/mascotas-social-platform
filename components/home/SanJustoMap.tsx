"use client";

import { useEffect, useRef } from "react";

const SanJustoMap: React.FC = () => {
  const mapFrameRef = useRef<HTMLIFrameElement>(null);

  // Coordenadas de San Justo, Santa Fe, Argentina
  const lat = -30.7872;
  const lng = -60.5838;

  // URL del mapa - centro desplazado a la izquierda para que San Justo aparezca a la derecha
  const centerLng = lng - 0.005;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.012}%2C${lat - 0.012}%2C${centerLng + 0.012}%2C${lat + 0.012}&layer=mapnik`;

  useEffect(() => {
    // Actualizar el iframe cuando cargue
    if (mapFrameRef.current) {
      mapFrameRef.current.src = mapUrl;
    }
  }, [mapUrl]);

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
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
      </div>
    </section>
  );
};

export default SanJustoMap;
