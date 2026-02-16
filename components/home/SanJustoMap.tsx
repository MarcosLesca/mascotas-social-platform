"use client";

import { useEffect, useRef, useState } from "react";

const SanJustoMap: React.FC = () => {
  const mapFrameRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState(0.012);
  const [centerOffset, setCenterOffset] = useState(0.005);

  // Coordenadas de San Justo, Santa Fe, Argentina
  const lat = -30.7872;
  const lng = -60.5838;

  useEffect(() => {
    // Detectar tamaño de pantalla
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoom(0.015); // Menos zoom (más cerca) en móvil
        setCenterOffset(0.01); // Un poco a la izquierda en móvil
      } else {
        setZoom(0.012); // Normal en PC
        setCenterOffset(0.005); // Normal en PC
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // URL del mapa - centro desplazado para que San Justo aparezca en la posición correcta
  const centerLng = lng - centerOffset;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - zoom}%2C${lat - zoom}%2C${centerLng + zoom}%2C${lat + zoom}&layer=mapnik`;

  useEffect(() => {
    // Actualizar el iframe cuando cargue
    if (mapFrameRef.current) {
      mapFrameRef.current.src = mapUrl;
    }
  }, [mapUrl]);

  return (
    <section className="w-full pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Contenedor del mapa */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full">
            <iframe
              ref={mapFrameRef}
              src={mapUrl}
              title="Mapa de San Justo, Santa Fe"
              className="w-full h-full border-0 pointer-events-none"
              allowFullCell
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ minHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SanJustoMap;
