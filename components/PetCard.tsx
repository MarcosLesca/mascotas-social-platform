import React, { useState, useRef, useEffect } from "react";
import { Pet } from "../types";

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const isLost = pet.status === "lost";

  // Cerrar menú cuando se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShareMenu]);
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

  const handleShare = async (platform: string) => {
    // Construir URL según el tipo de mascota
    const basePath = isLost ? "/lost-pets" : "/adoption";
    const petUrl = `${window.location.origin}${basePath}?pet=${pet.id}`;

    const shareData = {
      title: `${isLost ? "Mascota Perdida" : "Mascota en Adopción"}: ${pet.name}`,
      text: `${isLost ? "Ayuda a encontrar" : "Conoce a"} ${pet.name}, ${pet.breed}${isLost ? ` - visto en ${pet.location}` : " - busca un hogar"}. ¡Ayudanos a compartir!`,
      url: petUrl,
    };

    // Notificar al padre
    onShare?.(pet, platform);

    // Usar Web Share API si está disponible (móvil)
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Si el usuario cancela, no hacer nada
        if ((err as Error).name === "AbortError") return;
      }
    }

    switch (platform) {
      case "native":
      case "copy_link":
        try {
          await navigator.clipboard.writeText(petUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Error al copiar:", err);
        }
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
          "_blank",
        );
        break;
      case "sms":
        window.open(
          `sms:?body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
        );
        break;
    }
  };

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
        <div className="absolute bottom-3 right-3 flex gap-2 overflow-visible">
          <div className="relative overflow-visible">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold hover:bg-white transition-colors"
            >
              Compartir
            </button>

            {showShareMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowShareMenu(false)}
                />

                {/* Modal */}
                <div
                  ref={shareMenuRef}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[320px] max-w-[90vw] bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  {/* Header con imagen */}
                  <div className="relative h-32">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      type="button"
                      onClick={() => setShowShareMenu(false)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-white font-bold text-sm truncate">
                        {pet.name}
                      </p>
                      <p className="text-white/80 text-xs truncate">
                        {isLost ? `Perdido en ${pet.location}` : pet.location}
                      </p>
                    </div>
                  </div>

                  {/* Opciones */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                      Compartir en
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {navigator.share && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare("native");
                            setShowShareMenu(false);
                          }}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                              share
                            </span>
                          </div>
                          <span className="text-xs font-medium">
                            Más opciones
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("whatsapp");
                          setShowShareMenu(false);
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.92.5 3.8 1.45 5.45L2 22l4.82-1.56a9.83 9.83 0 0 0 5.22 1.5h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2zm5.73 14.16c-.24.67-1.18 1.29-1.97 1.46-.54.11-1.24.2-3.6-.78-3.02-1.25-4.97-4.32-5.12-4.52-.14-.2-1.23-1.64-1.23-3.14 0-1.5.78-2.24 1.06-2.54.28-.3.61-.38.81-.38h.58c.18 0 .43-.07.67.51.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.32.38-.46.51-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.2-.3.41-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.34.07.12.07.69-.17 1.36z"></path>
                          </svg>
                        </div>
                        <span className="text-xs font-medium">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("sms");
                          setShowShareMenu(false);
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                            chat
                          </span>
                        </div>
                        <span className="text-xs font-medium">SMS</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("email");
                          setShowShareMenu(false);
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                            mail
                          </span>
                        </div>
                        <span className="text-xs font-medium">Email</span>
                      </button>
                    </div>

                    {/* Copiar link */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare("copy_link");
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-sm">
                              link
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {copied ? "¡Copiado!" : "Copiar enlace"}
                          </span>
                        </div>
                        {copied && (
                          <span className="text-green-600 text-sm">✓</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
              {pet.gender === "male" ? "Macho" : "Hembra"}
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
            className={`flex-1 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 ${
              isLost
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#22c55e] hover:bg-[#16a34a]"
            }`}
          >
            {isLost ? "La vi" : "Adoptar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
