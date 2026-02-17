import React, { useState } from "react";
import { Pet } from "../types";
import ImageViewer from "./ImageViewer";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function normalizePhoneNumber(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("54")) {
    return "54" + digits.slice(2);
  }
  if (digits.startsWith("0")) {
    return "54" + digits.slice(1);
  }
  if (digits.length === 11) {
    return "54" + digits;
  }
  return "54" + digits;
}

interface PetDetailModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (pet: Pet, action: string) => void;
  variant?: "modal" | "fullscreen";
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({
  pet,
  isOpen,
  onClose,
  onAction,
  variant = "modal",
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!isOpen || !pet) return null;

  const isLost = pet.status === "lost";
  const hasPhone = !!pet.contactPhone?.trim();
  const hasEmail = !!pet.contactEmail?.trim();
  const hasContact = hasPhone || hasEmail || !!pet.contactName?.trim();
  const waNumber = hasPhone ? normalizePhoneNumber(pet.contactPhone!) : "";
  const seenMessage = `Hola, creo haber visto a ${pet.name} publicada en Mascotas SJ.\nLa vi en ___________, aproximadamente el ___/___/____.\nSi necesitan más información puedo ayudar.`;
  const adoptMessage = `Hola! Vi tu publicación sobre ${pet.name} y me gustaría saber más detalles y cómo iniciar el proceso de adopción.`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(isLost ? seenMessage : adoptMessage)}`
    : null;
  const mailHref = hasEmail
    ? `mailto:${pet.contactEmail!.trim()}?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`
    : null;

  const speciesLabel =
    {
      dog: "Perro",
      cat: "Gato",
      bird: "Ave",
      other: "Otro",
    }[pet.species] || pet.species;

  const sizeLabel =
    {
      small: "Chico",
      medium: "Mediano",
      large: "Grande",
    }[pet.size || ""] || "";

  const isFullscreen = variant === "fullscreen";

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-background-dark overflow-y-auto"
    : "fixed inset-0 z-50 p-4 pb-24 bg-black/50 backdrop-blur-sm overflow-y-auto";

  const contentClasses = isFullscreen
    ? "w-full min-h-screen bg-white dark:bg-background-dark"
    : "bg-white dark:bg-background-dark rounded-3xl w-full shadow-2xl";

  return (
    <>
      <div
        className={containerClasses}
        onClick={!isFullscreen ? onClose : undefined}
      >
        <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
          {/* Header con imagen */}
          <div
            className="relative h-56 sm:h-72 overflow-hidden bg-black cursor-zoom-in group"
            onClick={() => setIsImageViewerOpen(true)}
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Búsqueda Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
              <div className="bg-black/30 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
                <span className="material-symbols-outlined text-white text-3xl">
                  zoom_in
                </span>
              </div>
            </div>

            {/* Botón cerrar */}
            {/* Botón cerrar / volver */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={`absolute top-4 ${isFullscreen ? "left-4" : "right-4"} z-10 px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-full text-sm font-black transition-all shadow-lg flex items-center gap-2`}
            >
              {isFullscreen && (
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
              )}
              {isFullscreen ? "Volver" : "Cerrar"}
            </button>

            {/* Badges */}
            <div className="absolute bottom-6 left-6 flex gap-3 pointer-events-none">
              {pet.urgency && (
                <span className="bg-red-400 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  Urgente
                </span>
              )}
              <span
                className={`${isLost ? "bg-red-400 text-white" : "bg-primary text-black"} text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg`}
              >
                {isLost ? "Mascota perdida" : "En adopción"}
              </span>
              {pet.timeLabel && (
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  {pet.timeLabel}
                </span>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8 max-w-4xl mx-auto pb-40 md:pb-32 lg:pb-28">
            <h2 className="text-2xl font-black mb-6">{pet.name}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Descripción */}
                {pet.description && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">Descripción:</h3>
                    <p className="text-black leading-relaxed">
                      {pet.description}
                    </p>
                  </div>
                )}

                {/* Requisitos de adopción */}
                {pet.status === "adoption" && pet.requirements && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">Requisitos:</h3>
                    <p className="text-black leading-relaxed">
                      {pet.requirements}
                    </p>
                  </div>
                )}

                {/* Ubicación */}
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    {isLost ? "Visto por última vez:" : "Ubicación:"}
                  </h3>
                  <p className="text-black font-medium">{pet.location}</p>
                  {pet.lastSeenLocation && (
                    <p className="text-sm text-black/80 mt-1">
                      Última ubicación: {pet.lastSeenLocation}
                    </p>
                  )}
                  {pet.lastSeenDate && (
                    <p className="text-sm text-black/80">
                      Fecha: {new Date(pet.lastSeenDate).toLocaleDateString('es-AR')}
                    </p>
                  )}
                  {pet.distance && (
                    <p className="text-sm text-black/80 mt-1">
                      A {pet.distance} de tu ubicación
                    </p>
                  )}
                </div>

                {/* Estado médico */}
                {pet.medStatus && pet.medStatus.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">Estado:</h3>
                    <div className="flex flex-wrap gap-2">
                      {pet.medStatus.map((status, idx) => (
                        <span
                          key={idx}
                          className={`${
                            isLost
                              ? "bg-red-100 text-red-800"
                              : "bg-primary/10 text-primary-dark"
                          } px-3 py-1 rounded-full text-sm font-bold`}
                        >
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información de contacto */}
                {(hasContact || !isLost) && (
                  <div
                    className={`rounded-2xl p-6 ${
                      isLost
                        ? "bg-red-50 dark:bg-red-900/10"
                        : "bg-accent-teal/5"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">
                      Información de Contacto
                    </h3>
                    <div className="space-y-3">
                      {pet.contactName && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold">Contacto:</span>
                          <span className="font-medium">{pet.contactName}</span>
                        </div>
                      )}
                      {hasPhone && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold">Número:</span>
                          {waHref ? (
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-medium text-black transition-colors ${
                                isLost
                                  ? "hover:text-red-500"
                                  : "hover:text-primary"
                              }`}
                            >
                              {pet.contactPhone}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {pet.contactPhone}
                            </span>
                          )}
                        </div>
                      )}
                      {hasEmail && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold">Email:</span>
                          {mailHref ? (
                            <a
                              href={mailHref}
                              className={`font-medium text-black transition-colors ${
                                isLost
                                  ? "hover:text-red-500"
                                  : "hover:text-primary"
                              }`}
                            >
                              {pet.contactEmail}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {pet.contactEmail}
                            </span>
                          )}
                        </div>
                      )}
                      {!hasContact && !isLost && (
                        <p className="text-sm text-black">
                          Contacto disponible en la publicación.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna lateral - Acciones */}
              <div className="space-y-6">
                {/* Acciones principales */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (waHref) {
                        window.open(waHref, "_blank");
                      } else {
                        onAction?.(pet, isLost ? "seen" : "adopt");
                      }
                    }}
                    className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg ${
                      isLost
                        ? "bg-red-400 hover:bg-red-500 text-white"
                        : "bg-primary hover:bg-primary/90 text-background-dark"
                    }`}
                  >
                    {isLost ? "Vi la mascota" : "Quiero Adoptar"}
                  </button>

                  {waHref && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg text-white ${
                        isLost
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.92.5 3.8 1.45 5.45L2 22l4.82-1.56a9.83 9.83 0 0 0 5.22 1.5h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2zm5.73 14.16c-.24.67-1.18 1.29-1.97 1.46-.54.11-1.24.2-3.6-.78-3.02-1.25-4.97-4.32-5.12-4.52-.14-.2-1.23-1.64-1.23-3.14 0-1.5.78-2.24 1.06-2.54.28-.3.61-.38.81-.38h.58c.18 0 .43-.07.67.51.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.32.38-.46.51-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.2-.3.41-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.34.07.12.07.69-.17 1.36z"></path>
                      </svg>
                      Contactar por WhatsApp
                    </a>
                  )}

                  {mailHref && (
                    <a
                      href={mailHref}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold ${
                        isLost
                          ? "bg-white dark:bg-white/5 border-2 border-red-400 hover:border-red-400 text-red-400 hover:bg-red-400/5"
                          : "bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary hover:bg-primary/5"
                      }`}
                    >
                      Enviar Email
                    </a>
                  )}
                </div>

                {/* Información adicional */}
                <div
                  className={`rounded-2xl p-6 border ${
                    isLost
                      ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
                      : "bg-white dark:bg-white/5 border-accent-teal/5"
                  }`}
                >
                  <h4 className="font-bold mb-4">Características</h4>
                  <div className="space-y-3">
                    {pet.breed && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Raza:</span>
                        <span className="text-sm font-bold">{pet.breed}</span>
                      </div>
                    )}
                    {pet.color && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Color:</span>
                        <span className="text-sm font-bold">{pet.color}</span>
                      </div>
                    )}
                    {isLost && pet.reward && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Recompensa:</span>
                        <span
                          className={`text-sm font-bold ${isLost ? "text-red-600" : "text-green-600"}`}
                        >
                          {pet.reward}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Especie:</span>
                      <span className="text-sm font-bold">{speciesLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Género:</span>
                      <span className="text-sm font-bold">
                        {pet.gender === "male" ? "Macho" : "Hembra"}
                      </span>
                    </div>
                    {pet.size && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Tamaño:</span>
                        <span className="text-sm font-bold">{sizeLabel}</span>
                      </div>
                    )}
                    {pet.age && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Edad:</span>
                        <span className="text-sm font-bold">
                          {pet.age} años
                        </span>
                      </div>
                    )}
                    {pet.distinctiveFeatures && (
                      <div className="flex justify-between">
                        <span className="text-sm text-black">Marcas:</span>
                        <span className="text-sm font-bold">{pet.distinctiveFeatures}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Estado:</span>
                      <span className="text-sm font-bold">
                        {isLost ? "Perdida" : "Adopción"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de imágenes */}
      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        src={pet.image}
        alt={pet.name}
      />
    </>
  );
};

export default PetDetailModal;
