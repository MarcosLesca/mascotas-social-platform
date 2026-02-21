import React, { useState } from "react";
import { Pet } from "../types";
import ShareModal from "./ShareModal";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function normalizePhoneNumber(phone: string): string {
  const digits = digitsOnly(phone);
  // Si ya tiene 54 (código Argentina), usarlo tal cual
  if (digits.startsWith("54")) {
    return "54" + digits.slice(2);
  }
  // Si empieza con 0 (código de área), quitarlo y agregar 54
  if (digits.startsWith("0")) {
    return "54" + digits.slice(1);
  }
  // Si ya tiene 11 dígitos (sin 0), agregar 54
  if (digits.length === 11) {
    return "54" + digits;
  }
  // Cualquier otro caso, agregar 54
  return "54" + digits;
}

interface PetCardProps {
  pet: Pet;
  onAction?: (pet: Pet, action: string) => void;
  onViewDetails?: (pet: Pet) => void;
  onShare?: (pet: Pet, action: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onAction,
  onViewDetails,
  onShare,
}) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const isLost = pet.status === "lost";
  
  const urgentBadgeClass =
    "bg-red-400 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg";
  const topBadgeClass =
    "px-2.5 sm:px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold";
  const hasPhone = !!pet.contactPhone?.trim();
  const hasEmail = !!pet.contactEmail?.trim();
  const hasContact = hasPhone || hasEmail;
  const waNumber = hasPhone ? normalizePhoneNumber(pet.contactPhone!) : "";
  const seenMessage = `Hola, creo haber visto a ${pet.name} publicada en Mascotas SJ.\nLa vi en ___________, aproximadamente el ___/___/____.\nSi necesitan más información puedo ayudar.`;
  const adoptMessage = `Hola! Vi tu publicación sobre ${pet.name} y me gustaría saber más detalles y cómo iniciar el proceso de adopción.`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(isLost ? seenMessage : adoptMessage)}`
    : null;
  const mailHref = hasEmail
    ? `mailto:${pet.contactEmail!.trim()}?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`
    : null;

  return (
    <div className="group h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-accent-teal/5 hover:shadow-xl transition-all duration-300 card-hover stagger-item flex flex-col">
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {pet.urgency && <span className={urgentBadgeClass}>Urgente</span>}
          {pet.timeLabel && (
            <span className={topBadgeClass}>{pet.timeLabel}</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#203553', color: '#ecdbbd' }}
          >
            Compartir
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div
          className="flex justify-between items-start mb-1 sm:mb-2 cursor-pointer"
          onClick={() => onViewDetails?.(pet)}
        >
          <div>
            <h3
              className={`text-base sm:text-xl leading-tight font-bold transition-colors ${
                isLost ? "group-hover:text-red-500" : "group-hover:text-primary"
              }`}
            >
              {pet.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate max-w-[180px] sm:max-w-none">
              {pet.gender === "male" ? "Macho" : "Hembra"} - {pet.species === "dog" ? "Perro" : pet.species === "cat" ? "Gato" : pet.species === "bird" ? "Ave" : pet.species === "rabbit" ? "Conejo" : pet.species === "hamster" ? "Hámster" : pet.species === "turtle" ? "Tortuga" : "Otro"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-2 sm:mb-6">
          <div>
            <p className="text-xs sm:text-sm font-bold leading-snug">
              {isLost ? `Visto: ${pet.location}` : pet.location}
            </p>
            {pet.distance && (
              <p className="text-[10px] sm:text-xs text-gray-500">
                {pet.distance} de distancia
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <button
            onClick={() => onAction?.(pet, "view")}
            className={`flex-1 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 ${
              isLost
                ? "bg-red-400 hover:bg-red-500"
                : "bg-accent-teal hover:bg-primary"
            }`}
          >
            Ver detalles
          </button>
          <button
            onClick={() => {
              if (waHref) {
                window.open(waHref, "_blank");
              } else {
                onAction?.(pet, "seen");
              }
            }}
            className={`hidden sm:flex flex-1 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-full items-center justify-center gap-2 transition-colors duration-200 ${
              isLost
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#22c55e] hover:bg-[#16a34a]"
            }`}
          >
            {isLost ? "La vi" : "Adoptar"}
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        item={{
          id: pet.id,
          image: pet.image,
          name: pet.name,
          location: pet.location,
        }}
        type="pet"
      />
    </div>
  );
};

export default PetCard;
