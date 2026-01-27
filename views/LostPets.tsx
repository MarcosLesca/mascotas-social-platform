
import React, { useState } from 'react';
import { MOCK_LOST_PETS } from '../constants';
import PetCard from '../components/PetCard';

const LostPets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold mb-2">Búsqueda de Mascotas Perdidas</h2>
          <p className="text-accent-teal text-lg">Ayuda a reunir hoy a <span className="text-primary font-bold">1,240</span> mascotas con sus familias.</p>
        </div>
        <div className="flex gap-2 bg-accent-teal/5 p-1 rounded-2xl">
          <button className="px-6 py-2 bg-white dark:bg-white/10 shadow-sm rounded-xl font-bold text-sm">Cuadrícula</button>
          <button className="px-6 py-2 rounded-xl font-bold text-sm text-accent-teal">Mapa</button>
        </div>
      </div>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-teal text-2xl">search</span>
        <input 
          type="text" 
          placeholder="Busca por raza, color o zona..."
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {['Especie', 'Fecha', 'Ubicación', 'Color'].map((filter) => (
          <button key={filter} className="px-5 py-2.5 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-primary transition-colors">
            {filter} <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        ))}
        <button className="ml-auto text-primary text-sm font-bold hover:underline">Limpiar filtros</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_LOST_PETS.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
        
        {/* Report Placeholder Card */}
        <div className="bg-primary/5 dark:bg-primary/10 border-4 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-primary/10 transition-all min-h-[400px]">
          <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl font-bold">add</span>
          </div>
          <h3 className="text-xl font-bold mb-3">¿Has perdido a alguien?</h3>
          <p className="text-sm text-accent-teal mb-8 max-w-[220px]">Reporta ahora y activa la red de búsqueda en tu zona.</p>
          <button className="bg-primary text-background-dark px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 transition-all">COMENZAR</button>
        </div>
      </div>
    </div>
  );
};

export default LostPets;
