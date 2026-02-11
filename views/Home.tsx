
import React, { useEffect, useState } from 'react';
import { MOCK_CAMPAIGNS } from '../constants';
import HeroZoom from '../components/home/HeroZoom';
import { fetchApprovedLostPets } from '../services/lostPetsService';
import { fetchApprovedAdoptionPets } from '../services/adoptionPetsService';
import { useApp } from '../context/AppContext';
import type { Pet, DonationCampaign } from '../types';
import { View } from '../types';

interface HomeProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Home: React.FC<HomeProps> = ({ onToast }) => {
  const { setCurrentView } = useApp();
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const [lostRes, adoptionRes] = await Promise.all([
        fetchApprovedLostPets(),
        fetchApprovedAdoptionPets(),
      ]);

      if (cancelled) return;

      if (lostRes.error) {
        onToast('No se pudieron cargar las últimas mascotas perdidas.', 'error');
      } else {
        setLostPets(lostRes.data);
      }

      if (adoptionRes.error) {
        onToast('No se pudieron cargar las mascotas en adopción.', 'error');
      } else {
        setAdoptionPets(adoptionRes.data);
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [onToast]);

  const latestLost = lostPets.slice(0, 4);
  const latestAdoption = adoptionPets.slice(0, 4);
  const latestDonations: DonationCampaign[] = MOCK_CAMPAIGNS.slice(0, 4);

  return (
    <>
      {/* Hero Section con GSAP Animation - Full Width */}
      <HeroZoom />
      
      {/* Listas principales debajo del hero */}
      <div className="relative px-4 md:px-10 lg:px-20 py-12" style={{ marginTop: '200vh' }}>
        <div className="max-w-[1440px] mx-auto space-y-12">
          {/* Últimas mascotas perdidas */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black mb-6">Últimas mascotas perdidas</h2>
            {loading && lostPets.length === 0 ? (
              <p className="text-accent-teal text-sm">Cargando mascotas perdidas…</p>
            ) : latestLost.length === 0 ? (
              <p className="text-accent-teal text-sm">Todavía no hay mascotas perdidas publicadas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestLost.map((pet) => (
                  <article
                    key={pet.id}
                    className="bg-white dark:bg-white/5 rounded-2xl border border-accent-teal/10 overflow-hidden shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
                    onClick={() => setCurrentView(View.LOST_PETS)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="text-base font-bold">{pet.name}</h3>
                      <p className="text-xs text-accent-teal">
                        {pet.breed}
                      </p>
                      <p className="text-xs text-accent-teal">
                        {pet.location}
                      </p>
                      {pet.timeLabel && (
                        <p className="text-[11px] text-accent-teal/80">
                          {pet.timeLabel}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {latestLost.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => setCurrentView(View.LOST_PETS)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver más
                </button>
              </div>
            )}
          </section>

          {/* Últimas mascotas en adopción */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black mb-6">Mascotas que buscan adopción</h2>
            {loading && adoptionPets.length === 0 ? (
              <p className="text-accent-teal text-sm">Cargando mascotas en adopción…</p>
            ) : latestAdoption.length === 0 ? (
              <p className="text-accent-teal text-sm">Todavía no hay mascotas en adopción publicadas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestAdoption.map((pet) => (
                  <article
                    key={pet.id}
                    className="bg-white dark:bg-white/5 rounded-2xl border border-accent-teal/10 overflow-hidden shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
                    onClick={() => setCurrentView(View.ADOPTION)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="text-base font-bold">{pet.name}</h3>
                      <p className="text-xs text-accent-teal">
                        {pet.breed}
                      </p>
                      <p className="text-xs text-accent-teal">
                        {pet.location}
                      </p>
                      {pet.age && (
                        <p className="text-[11px] text-accent-teal/80">
                          {pet.age}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {latestAdoption.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => setCurrentView(View.ADOPTION)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver más
                </button>
              </div>
            )}
          </section>

          {/* Últimas donaciones publicadas */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black mb-6">Últimas campañas de donación</h2>
            {latestDonations.length === 0 ? (
              <p className="text-accent-teal text-sm">Todavía no hay campañas de donación publicadas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestDonations.map((campaign) => (
                  <article
                    key={campaign.id}
                    className="bg-white dark:bg-white/5 rounded-2xl border border-accent-teal/10 overflow-hidden shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
                    onClick={() => setCurrentView(View.DONATIONS)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="text-base font-bold line-clamp-2">{campaign.title}</h3>
                      <p className="text-xs text-accent-teal line-clamp-3">
                        {campaign.description}
                      </p>
                      <p className="text-[11px] text-accent-teal/80">
                        Meta: ${campaign.goal.toLocaleString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {latestDonations.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => setCurrentView(View.DONATIONS)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver más
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
