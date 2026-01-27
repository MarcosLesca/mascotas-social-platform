
import React from 'react';
import { MOCK_ADOPTION_PETS } from '../constants';
import PetCard from '../components/PetCard';

const Adoption: React.FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-black tracking-tight mb-4">Encuentra a tu mejor amigo</h1>
        <p className="text-xl text-accent-teal font-display italic">Descubre mascotas amorosas listas para un hogar definitivo. Cada adopción salva una vida.</p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-accent-teal/5 sticky top-24">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Filtros</h3>
              <button className="text-xs font-bold text-primary">LIMPIAR</button>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs font-black text-accent-teal uppercase tracking-widest mb-4">Especie</p>
                <div className="flex flex-wrap gap-2">
                  {['Perros', 'Gatos', 'Aves'].map(s => (
                    <button key={s} className={`px-4 py-2 rounded-full text-xs font-bold ${s === 'Perros' ? 'bg-primary text-background-dark' : 'bg-accent-teal/5 text-accent-teal'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-accent-teal uppercase tracking-widest mb-4">Edad</p>
                <div className="space-y-3">
                  {['Cachorro', 'Joven', 'Adulto', 'Senior'].map(age => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary border-accent-teal/20" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-accent-teal uppercase tracking-widest mb-4">Energía</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Bajo', 'Medio', 'Alto'].map(e => (
                    <button key={e} className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter ${e === 'Medio' ? 'bg-primary text-background-dark' : 'bg-accent-teal/5 text-accent-teal'}`}>{e}</button>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full mt-10 bg-primary text-background-dark py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">APLICAR FILTROS</button>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {MOCK_ADOPTION_PETS.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          <div className="mt-16 p-12 bg-accent-teal/5 rounded-[2.5rem] border border-accent-teal/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6">Guía de Adopción Responsable</h2>
                <p className="text-accent-teal mb-8 leading-relaxed">Adoptar es un compromiso de por vida. Te ayudamos a preparar tu hogar y corazón para la llegada de tu nuevo integrante.</p>
                <div className="space-y-4">
                  {[
                    'Evaluación de estilo de vida',
                    'Cuidado veterinario inicial',
                    'Adaptación y socialización'
                  ].map(step => (
                    <div key={step} className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary bg-white dark:bg-white/10 p-2 rounded-xl">check_circle</span>
                      <span className="font-bold">{step}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-10 bg-white dark:bg-white/10 text-primary px-8 py-4 rounded-2xl font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all">Ver guía completa</button>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1554692998-192502d4a49c?q=80&w=600&auto=format&fit=crop" className="rounded-3xl shadow-2xl rotate-3" alt="Happy Dog" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adoption;
