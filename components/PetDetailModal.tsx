import React from 'react';
import { Pet } from '../types';

interface PetDetailModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (pet: Pet, action: string) => void;
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, isOpen, onClose, onAction }) => {
  if (!isOpen || !pet) return null;

  const isLost = pet.status === 'lost';

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
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
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
                  <p className="text-accent-teal leading-relaxed">{pet.description}</p>
                </div>
              )}

              {/* Ubicación */}
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  {isLost ? 'Última Vez Visto' : 'Ubicación'}
                </h3>
                <p className="text-accent-teal font-medium">{pet.location}</p>
                {pet.distance && (
                  <p className="text-sm text-accent-teal/80 mt-1">A {pet.distance} de tu ubicación</p>
                )}
              </div>

              {/* Estado médico */}
              {pet.medStatus && pet.medStatus.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">medical_services</span>
                    Estado Médico
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.medStatus.map((status, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de contacto */}
              <div className="bg-accent-teal/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <span className="font-medium">Dueño: Ana García</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">phone</span>
                    <a 
                      href={`https://wa.me/5491123456789?text=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me interesa. ¿Podríamos conversar?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent-teal hover:text-primary transition-colors underline flex items-center gap-2"
                    >
                      +54 9 11 2345-6789
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <a 
                      href={`mailto:ana.garcia@email.com?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`}
                      className="font-medium text-accent-teal hover:text-primary transition-colors underline"
                    >
                      ana.garcia@email.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna lateral - Acciones */}
            <div className="space-y-6">
              {/* Acciones principales */}
              <div className="space-y-3">
                <button 
                  onClick={() => onAction?.(pet, isLost ? 'seen' : 'adopt')}
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isLost ? 'visibility' : 'favorite'}
                  </span>
                  {isLost ? '¡He visto a esta mascota!' : 'Quiero Adoptar'}
                </button>

                <a 
                  href={`https://wa.me/5491123456789?text=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me interesa. ¿Podríamos conversar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-2xl">whatsapp</span>
                  Contactar por WhatsApp
                </a>

                <a 
                  href={`mailto:ana.garcia@email.com?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`}
                  className="w-full bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl">mail</span>
                  Enviar Email
                </a>

                <button className="w-full bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                  <span className="material-symbols-outlined text-2xl">share</span>
                  Compartir
                </button>
              </div>

              {/* Información adicional */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/5">
                <h4 className="font-bold mb-4">Características</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-accent-teal">Especie</span>
                    <span className="text-sm font-bold capitalize">{pet.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-accent-teal">Género</span>
                    <span className="text-sm font-bold">{pet.gender === 'male' ? 'Macho' : 'Hembra'}</span>
                  </div>
                  {pet.age && (
                    <div className="flex justify-between">
                      <span className="text-sm text-accent-teal">Edad</span>
                      <span className="text-sm font-bold">{pet.age}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-accent-teal">Estado</span>
                    <span className="text-sm font-bold capitalize">{pet.status}</span>
                  </div>
                </div>
              </div>

              {/* Alerta de seguridad */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800/30">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-xl">warning</span>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Seguridad Primero</h5>
                    <p className="text-xs text-accent-teal">
                      {isLost 
                        ? 'Nunca envíes dinero por adelantado. Encuentrate en un lugar público.' 
                        : 'Verifica la información del refugio. Pide certificados veterinarios.'
                      }
                    </p>
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