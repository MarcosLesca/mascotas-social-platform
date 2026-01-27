
import React from 'react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onAction?: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onAction }) => {
  const isLost = pet.status === 'lost';

  return (
    <div className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-accent-teal/5 hover:shadow-xl transition-all duration-300">
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
        <button className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors">
          <span className="material-symbols-outlined text-xl">favorite</span>
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pet.name}</h3>
            <p className="text-xs text-accent-teal font-semibold uppercase tracking-wide">{pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}</p>
          </div>
          <button className="text-accent-teal hover:text-primary">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>

        <div className="flex items-start gap-2 mb-6">
          <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
          <div>
            <p className="text-sm font-bold">{isLost ? `Visto: ${pet.location}` : pet.location}</p>
            {pet.distance && <p className="text-xs text-accent-teal">{pet.distance} de distancia</p>}
          </div>
        </div>

        <button 
          onClick={() => onAction?.(pet)}
          className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">{isLost ? 'visibility' : 'info'}</span>
          {isLost ? 'He visto a esta mascota' : 'Ver Perfil'}
        </button>
      </div>
    </div>
  );
};

export default PetCard;
