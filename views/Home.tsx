import React, { useEffect, useMemo, useState } from "react";
import HeroZoom from "../components/home/HeroZoom";
import { fetchApprovedLostPets } from "../services/lostPetsService";
import { fetchApprovedAdoptionPets } from "../services/adoptionPetsService";
import { fetchApprovedDonationCampaigns } from "../services/donationCampaignsService";
import { useApp } from "../context/AppContext";
import type { Pet, DonationCampaign } from "../types";
import { View } from "../types";
import PetCard from "../components/PetCard";

interface HomeProps {
  onToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
    showAcceptButton?: boolean,
  ) => void;
}

type MixedCard =
  | { kind: "lost"; id: string; pet: Pet }
  | { kind: "adoption"; id: string; pet: Pet }
  | { kind: "donation"; id: string; campaign: DonationCampaign };

const Home: React.FC<HomeProps> = ({ onToast }) => {
  const { setCurrentView } = useApp();
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const [lostRes, adoptionRes, donationRes] = await Promise.all([
        fetchApprovedLostPets(),
        fetchApprovedAdoptionPets(),
        fetchApprovedDonationCampaigns(),
      ]);

      if (cancelled) return;

      if (lostRes.error) {
        onToast(
          "No se pudieron cargar las últimas mascotas perdidas.",
          "error",
        );
      } else {
        setLostPets(lostRes.data);
      }

      if (adoptionRes.error) {
        onToast("No se pudieron cargar las mascotas en adopción.", "error");
      } else {
        setAdoptionPets(adoptionRes.data);
      }

      if (donationRes.error) {
        onToast("No se pudieron cargar las campañas de donación.", "error");
      } else {
        setDonationCampaigns(donationRes.data);
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [onToast]);

  const latestLost = lostPets.slice(0, 6);
  const latestAdoption = adoptionPets.slice(0, 6);
  const latestDonations = donationCampaigns.slice(0, 6);

  const mixedRecentCards = useMemo(() => {
    const cards: MixedCard[] = [];
    const maxLength = Math.max(
      latestLost.length,
      latestAdoption.length,
      latestDonations.length,
    );

    for (let i = 0; i < maxLength; i += 1) {
      if (latestLost[i]) {
        cards.push({
          kind: "lost",
          id: `lost-${latestLost[i].id}`,
          pet: latestLost[i],
        });
      }
      if (latestDonations[i]) {
        cards.push({
          kind: "donation",
          id: `donation-${latestDonations[i].id}`,
          campaign: latestDonations[i],
        });
      }
      if (latestAdoption[i]) {
        cards.push({
          kind: "adoption",
          id: `adoption-${latestAdoption[i].id}`,
          pet: latestAdoption[i],
        });
      }
    }

    return cards;
  }, [latestLost, latestAdoption, latestDonations]);

  return (
    <>
      {/* Hero Section con GSAP Animation - Full Width */}
      <HeroZoom />

      <div className="relative mt-[100vh] sm:mt-0 px-4 py-10 sm:py-12 md:px-10 lg:px-20 lg:mt-[200vh]">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <section>
            <h2 className="text-2xl md:text-5xl font-black leading-tight">
              Publicaciones recientes:
            </h2>
          </section>

          {loading && mixedRecentCards.length === 0 ? (
            <p className="text-gray-800 text-sm">
              Cargando publicaciones recientes...
            </p>
          ) : mixedRecentCards.length === 0 ? (
            <div className="rounded-3xl border border-accent-teal/10 bg-white dark:bg-white/5 p-8 text-center">
              <h3 className="text-xl font-black">
                Sin publicaciones recientes
              </h3>
              <p className="text-gray-800 text-sm mt-2">
                Todavia no hay datos para mostrar en el feed.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {mixedRecentCards.map((item) => {
                if (item.kind === "donation") {
                  const campaign = item.campaign;
                  return (
                    <article
                      key={item.id}
                      onClick={() => setCurrentView(View.DONATIONS)}
                      className="group h-full bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-sky-500/10 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="bg-sky-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                            Donación
                          </span>
                          {campaign.urgency && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                              Urgente
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-white text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-[10px]">pets</span>
                            {campaign.petName}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <h3 className="text-sm sm:text-base leading-tight font-bold group-hover:text-sky-500 transition-colors mb-1 line-clamp-2">
                          {campaign.title}
                        </h3>

                        <p className="text-xs text-black mb-3 line-clamp-2 leading-relaxed">
                          {campaign.description}
                        </p>

                        <div className="mt-auto space-y-2">
                          <div className="bg-sky-50 rounded-lg p-2 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-sky-700">Meta</span>
                            <span className="text-sm font-black text-sky-600">${campaign.goal.toLocaleString("es-AR")}</span>
                          </div>

                          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2 rounded-full transition-all flex items-center justify-center gap-2">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }

                const pet = item.pet;
                const isLost = item.kind === "lost";

                return (
                  <article
                    key={item.id}
                    onClick={() => setCurrentView(isLost ? View.LOST_PETS : View.ADOPTION)}
                    className="group h-full bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-accent-teal/5 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg ${
                          isLost ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {isLost ? 'Perdido' : 'Adopción'}
                        </span>
                        {isLost && pet.urgency && (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                            Urgente
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h3 className={`text-sm sm:text-base leading-tight font-bold transition-colors ${
                        isLost ? 'group-hover:text-rose-500' : 'group-hover:text-emerald-500'
                      }`}>
                        {pet.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate">
                        {pet.gender === 'male' ? 'Macho' : 'Hembra'}
                      </p>

                      <p className="text-xs font-bold leading-snug mt-1">
                        {isLost ? `Visto: ${pet.location}` : pet.location}
                      </p>

                      <div className="mt-auto pt-2">
                        <button className={`w-full text-white text-xs font-bold py-2 rounded-full transition-all flex items-center justify-center gap-2 ${
                          isLost ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}>
                          {isLost ? 'La vi' : 'Adoptar'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

