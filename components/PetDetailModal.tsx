import React from 'react';
import { Pet } from '../types';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

function normalizePhoneNumber(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith('54')) {
    return '54' + digits.slice(2);
  }
  if (digits.startsWith('0')) {
    return '54' + digits.slice(1);
  }
  if (digits.length === 11) {
    return '54' + digits;
  }
  return '54' + digits;
}

interface PetDetailModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (pet: Pet, action: string) => void;
  variant?: 'modal' | 'fullscreen';
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, isOpen, onClose, onAction, variant = 'modal' }) => {
  if (!isOpen || !pet) return null;

  const isLost = pet.status === 'lost';
  const hasPhone = !!pet.contactPhone?.trim();
  const hasEmail = !!pet.contactEmail?.trim();
  const hasContact = hasPhone || hasEmail || !!pet.contactName?.trim();
  const waNumber = hasPhone ? normalizePhoneNumber(pet.contactPhone!) : '';
  const seenMessage = `Hola, creo haber visto a ${pet.name} publicada en Mascotas SJ.\nLa vi en ___________, aproximadamente el ___/___/____.\nSi necesitan más información puedo ayudar.`;
  const adoptMessage = `Hola! Vi tu publicación sobre ${pet.name} y me gustaría saber más detalles y cómo iniciar el proceso de adopción.`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(isLost ? seenMessage : adoptMessage)}`
    : null;
  const mailHref = hasEmail
    ? `mailto:${pet.contactEmail!.trim()}?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`
    : null;

  const speciesLabel = {
    dog: 'Perro',
    cat: 'Gato',
    bird: 'Ave',
    other: 'Otro'
  }[pet.species] || pet.species;

  const isFullscreen = variant === 'fullscreen';

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-background-dark overflow-y-auto"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm";

  const contentClasses = isFullscreen
    ? "w-full min-h-screen bg-white dark:bg-background-dark"
    : "bg-white dark:bg-background-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl";

  return (
    <div className={containerClasses} onClick={!isFullscreen ? onClose : undefined}>
      <div
        className={contentClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          {/* Botón cerrar */}
          {/* Botón cerrar / volver */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isFullscreen ? 'left-4' : 'right-4'} z-10 px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-full text-sm font-black transition-all shadow-lg flex items-center gap-2`}
          >
            {isFullscreen && <span className="material-symbols-outlined text-lg">arrow_back</span>}
            {isFullscreen ? 'Volver' : 'Cerrar'}
          </button>

          {/* Badges */}
          <div className="absolute bottom-6 left-6 flex gap-3">
            {pet.urgency && (
              <span className="bg-red-400 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Urgente
              </span>
            )}
            <span className={`${isLost ? 'bg-red-400 text-white' : 'bg-primary text-black'} text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full`}>
              {isLost ? 'Mascota Perdida' : 'En Adopción'}
            </span>
            {pet.timeLabel && (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full">
                {pet.timeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className={`p-6 sm:p-8 ${!isFullscreen ? 'max-h-[50vh] overflow-y-auto' : ''}`}>
          <h2 className="text-2xl font-black mb-6">{pet.name}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Descripción */}
              {pet.description && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Descripción:</h3>
                  <p className="text-black leading-relaxed">{pet.description}</p>
                </div>
              )}

              {/* Requisitos de adopción */}
              {pet.status === 'adoption' && pet.requirements && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Requisitos:</h3>
                  <p className="text-black leading-relaxed">{pet.requirements}</p>
                </div>
              )}

              {/* Ubicación */}
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {isLost ? 'Visto por última vez:' : 'Ubicación:'}
                </h3>
                <p className="text-black font-medium">{pet.location}</p>
                {pet.distance && (
                  <p className="text-sm text-black/80 mt-1">A {pet.distance} de tu ubicación</p>
                )}
              </div>

              {/* Estado médico */}
              {pet.medStatus && pet.medStatus.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Estado:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.medStatus.map((status, idx) => (
                      <span key={idx} className={`${
                        isLost ? 'bg-red-100 text-red-800' : 'bg-primary/10 text-primary-dark'
                      } px-3 py-1 rounded-full text-sm font-bold`}>
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de contacto */}
              {(hasContact || !isLost) && (
                <div className={`rounded-2xl p-6 ${
                  isLost ? 'bg-red-50 dark:bg-red-900/10' : 'bg-accent-teal/5'
                }`}>
                  <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
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
                              isLost ? 'hover:text-red-500' : 'hover:text-primary'
                            }`}
                          >
                            {pet.contactPhone}
                          </a>
                        ) : (
                          <span className="font-medium">{pet.contactPhone}</span>
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
                              isLost ? 'hover:text-red-500' : 'hover:text-primary'
                            }`}
                          >
                            {pet.contactEmail}
                          </a>
                        ) : (
                          <span className="font-medium">{pet.contactEmail}</span>
                        )}
                      </div>
                    )}
                    {!hasContact && !isLost && (
                      <p className="text-sm text-black">Contacto disponible en la publicación.</p>
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
                      window.open(waHref, '_blank');
                    } else {
                      onAction?.(pet, isLost ? 'seen' : 'adopt');
                    }
                  }}
                  className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg ${
                    isLost
                      ? 'bg-red-400 hover:bg-red-500 text-white'
                      : 'bg-primary hover:bg-primary/90 text-background-dark'
                  }`}
                >
                  {isLost ? 'Vi la mascota' : 'Quiero Adoptar'}
                </button>

                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg text-white ${
                      isLost
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    Contactar por WhatsApp
                  </a>
                )}

                {mailHref && (
                  <a
                    href={mailHref}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold ${
                      isLost
                        ? 'bg-white dark:bg-white/5 border-2 border-red-400 hover:border-red-400 text-red-400 hover:bg-red-400/5'
                        : 'bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    Enviar Email
                  </a>
                )}
              </div>

              {/* Información adicional */}
              <div className={`rounded-2xl p-6 border ${
                isLost ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-white dark:bg-white/5 border-accent-teal/5'
              }`}>
                <h4 className="font-bold mb-4">Características</h4>
                <div className="space-y-3">
                  {isLost && pet.reward && (
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Recompensa:</span>
                      <span className={`text-sm font-bold ${isLost ? 'text-red-600' : 'text-green-600'}`}>{pet.reward}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Especie:</span>
                    <span className="text-sm font-bold">{speciesLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Género:</span>
                    <span className="text-sm font-bold">{pet.gender === 'male' ? 'Macho' : 'Hembra'}</span>
                  </div>
                  {pet.age && (
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Edad:</span>
                      <span className="text-sm font-bold">{pet.age} años</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Estado:</span>
                    <span className="text-sm font-bold">{isLost ? 'Perdida' : 'Adopción'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
