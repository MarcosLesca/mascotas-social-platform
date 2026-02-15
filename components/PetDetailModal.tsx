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
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, isOpen, onClose, onAction }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-background-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        <div className="relative aspect-[21/9] overflow-hidden">
          <img 
            src={pet.image} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Botón cerrar */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-1 bg-white/80 hover:bg-white text-slate-800 rounded-full text-xs font-bold transition-colors"
          >
            Cerrar
          </button>

          {/* Badges */}
          <div className="absolute bottom-6 left-6 flex gap-3">
            {pet.urgency && (
              <span className="bg-urgent-red text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Urgente
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
              {isLost ? 'Mascota Perdida' : 'En Adopción'}
            </span>
            {pet.timeLabel && (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full">
                {pet.timeLabel}
              </span>
            )}
          </div>

          {/* Nombre y raza */}
          <div className="absolute bottom-6 left-6 right-20">
            <h1 className="text-4xl font-black text-white mb-2">{pet.name}</h1>
            <p className="text-white/90 text-lg">{pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}{pet.age && ` • ${pet.age}`}</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Descripción */}
              {pet.description && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Descripción</h3>
                  <p className="text-black leading-relaxed">{pet.description}</p>
                </div>
              )}

              {/* Ubicación */}
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {isLost ? 'Última Vez Visto' : 'Ubicación'}
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
                    Estado Médico
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.medStatus.map((status, idx) => (
                      <span key={idx} className="bg-primary/10 text-black px-3 py-1 rounded-full text-sm font-bold">
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de contacto */}
              {(hasContact || !isLost) && (
                <div className="bg-accent-teal/5 rounded-2xl p-6">
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
                            className="font-medium text-black hover:text-primary transition-colors"
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
                            className="font-medium text-black hover:text-primary transition-colors"
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
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
                >
                  {isLost ? '¡He visto a esta mascota!' : 'Quiero Adoptar'}
                </button>

                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
                  >
                    Contactar por WhatsApp
                  </a>
                )}

                {mailHref && (
                  <a
                    href={mailHref}
                    className="w-full bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    Enviar Email
                  </a>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/5">
                <h4 className="font-bold mb-4">Características</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Especie</span>
                    <span className="text-sm font-bold capitalize">{pet.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Género</span>
                    <span className="text-sm font-bold">{pet.gender === 'male' ? 'Macho' : 'Hembra'}</span>
                  </div>
                  {pet.age && (
                    <div className="flex justify-between">
                      <span className="text-sm text-black">Edad</span>
                      <span className="text-sm font-bold">{pet.age}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Estado</span>
                    <span className="text-sm font-bold capitalize">{pet.status}</span>
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