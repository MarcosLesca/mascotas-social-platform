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
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const isLost = pet.status === 'lost';
  const hasPhone = !!pet.contactPhone?.trim();
  const hasEmail = !!pet.contactEmail?.trim();
  const hasContact = hasPhone || hasEmail;
  const waNumber = hasPhone ? digitsOnly(pet.contactPhone!) : '';
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me interesa. ¿Podríamos conversar?`)}`
    : null;
  const mailHref = hasEmail
    ? `mailto:${pet.contactEmail!.trim()}?subject=${encodeURIComponent(`Consulta sobre ${pet.name}`)}&body=${encodeURIComponent(`Hola! Vi tu publicación sobre ${pet.name} y me gustaría obtener más información.`)}`
    : null;

  const handleShare = (platform: string) => {
    const shareData = {
      title: `${isLost ? 'Mascota Perdida' : 'Mascota en Adopción'}: ${pet.name}`,
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
    <div className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-accent-teal/5 hover:shadow-xl transition-all duration-300 card-hover stagger-item">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {pet.urgency && (
            <span className="bg-urgent-red text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">Urgente</span>
          )}
          {pet.timeLabel && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{pet.timeLabel}</span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className={`p-2 backdrop-blur-md rounded-full transition-all ${
              isFavorited 
                ? 'bg-white/90 text-red-500' 
                : 'bg-white/20 hover:bg-white/40 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isFavorited ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
            
            {showShareMenu && (
              <div className="absolute top-12 right-0 bg-white dark:bg-background-dark rounded-xl shadow-xl border border-accent-teal/10 p-2 min-w-[160px] z-50">
                {[
                  { icon: 'public', label: 'Copiar link', action: 'copy_link' },
                  { icon: 'alternate_email', label: 'WhatsApp', action: 'whatsapp' },
                  { icon: 'sms', label: 'SMS', action: 'sms' },
                  { icon: 'mail', label: 'Email', action: 'email' }
                ].map(({ icon, label, action }) => (
                  <button
                    key={action}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(action);
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent-teal/5 rounded-lg text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-accent-teal">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div 
          className="flex justify-between items-start mb-2 cursor-pointer"
          onClick={() => onViewDetails?.(pet)}
        >
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pet.name}</h3>
            <p className="text-xs text-accent-teal font-semibold uppercase tracking-wide">{pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-6">
          <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
          <div>
            <p className="text-sm font-bold">{isLost ? `Visto: ${pet.location}` : pet.location}</p>
            {pet.distance && <p className="text-xs text-accent-teal">{pet.distance} de distancia</p>}
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onAction?.(pet, 'view')}
            className="flex-1 bg-white dark:bg-white/5 border border-accent-teal/20 hover:border-primary text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all btn-primary"
          >
            <span className="material-symbols-outlined text-xl">info</span>
            Ver Detalles
          </button>
          <button 
            onClick={() => onAction?.(pet, isLost ? 'seen' : 'adopt')}
            className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm btn-primary"
          >
            <span className="material-symbols-outlined text-xl">{isLost ? 'visibility' : 'favorite'}</span>
            {isLost ? 'La vi' : 'Adoptar'}
          </button>
        </div>

        {/* Quick Contact (solo si hay contacto y es perdida) */}
        {isLost && hasContact && (
          <div className="pt-3 border-t border-accent-teal/10">
            <div className="flex gap-2">
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">whatsapp</span>
                  WhatsApp
                </a>
              )}
              {mailHref && (
                <a
                  href={mailHref}
                  className="flex-1 bg-accent-teal hover:bg-primary text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
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
