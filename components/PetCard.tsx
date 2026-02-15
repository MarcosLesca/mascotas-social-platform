import React, { useState } from 'react';
import { Pet } from '../types';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

interface PetCardProps {
  pet: Pet;
  onAction?: (pet: Pet, action: string) => void;
  onViewDetails?: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onAction, onViewDetails }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const isLost = pet.status === 'lost';
  const urgentBadgeClass =
    'bg-urgent-red text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg';
  const topBadgeClass =
    'px-2.5 sm:px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold';
  const hasPhone = !!pet.contactPhone?.trim();
  const hasEmail = !!pet.contactEmail?.trim();
  const hasContact = hasPhone || hasEmail;
  const waNumber = hasPhone ? digitsOnly(pet.contactPhone!) : '';
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola! Vi tu publicaciÃ³n sobre ${pet.name} y me interesa. Â¿PodrÃ­amos conversar?`)}`
    : null;
  const mailHref = hasEmail
    ? `mailto:${pet.contactEmail!.trim()}?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicaciÃ³n sobre ${pet.name} y me gustarÃ­a obtener mÃ¡s informaciÃ³n.`)}`
    : null;

  const handleShare = (platform: string) => {
    const shareData = {
      title: `${isLost ? 'Mascota Perdida' : 'Mascota en AdopciÃ³n'}: ${pet.name}`,
      text: `${isLost ? 'Ayuda a encontrar' : 'Conoce a'} ${pet.name}, ${pet.breed}${isLost ? ` - visto en ${pet.location}` : ' - busca un hogar'}`,
      url: window.location.href
    };

    switch (platform) {
      case 'copy_link':
        navigator.clipboard.writeText(window.location.href);
        // TODO: Show toast notification
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`);
        break;
    }
  };

  return (
    <div className="group h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-accent-teal/5 hover:shadow-xl transition-all duration-300 card-hover stagger-item flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {pet.urgency && (
            <span className={urgentBadgeClass}>Urgente</span>
          )}
          {pet.timeLabel && (
            <span className={topBadgeClass}>{pet.timeLabel}</span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-white/40 text-slate-800 text-[11px] sm:text-xs font-bold hover:bg-white/60 transition-colors"
            >
              Compartir
            </button>
            
            {showShareMenu && (
              <div className="absolute top-10 right-0 bg-white dark:bg-background-dark rounded-xl shadow-xl border border-accent-teal/10 p-2 min-w-[160px] sm:min-w-[180px] z-50">
                {[
                  { label: 'Copiar link', action: 'copy_link' },
                  { label: 'Compartir por WhatsApp', action: 'whatsapp' },
                  { label: 'Compartir por SMS', action: 'sms' },
                  { label: 'Compartir por Email', action: 'email' }
                ].map(({ label, action }) => (
                  <button
                    key={action}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(action);
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent-teal/5 rounded-lg text-left transition-colors text-sm font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div 
          className="flex justify-between items-start mb-2 cursor-pointer"
          onClick={() => onViewDetails?.(pet)}
        >
          <div>
            <h3 className="text-lg sm:text-xl leading-tight font-bold group-hover:text-primary transition-colors">{pet.name}</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate max-w-[220px] sm:max-w-none">{pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-4 sm:mb-6">
          <div>
            <p className="text-sm font-bold leading-snug">{isLost ? `Visto: ${pet.location}` : pet.location}</p>
            {pet.distance && <p className="text-xs text-gray-500">{pet.distance} de distancia</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => onAction?.(pet, 'view')}
            className="flex-1 bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all btn-primary"
          >
            Ver Detalles
          </button>
          <button 
            onClick={() => onAction?.(pet, isLost ? 'seen' : 'adopt')}
            className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm btn-primary"
          >
            {isLost ? 'La vi' : 'Adoptar'}
          </button>
        </div>

        {/* Quick Contact (solo si hay contacto y es perdida) */}
        {isLost && hasContact && (
          <div className="pt-3 border-t border-accent-teal/10">
            <div className="flex flex-col sm:flex-row gap-2">
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  WhatsApp
                </a>
              )}
              {mailHref && (
                <a
                  href={mailHref}
                  className="flex-1 bg-accent-teal hover:bg-primary text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCard;


