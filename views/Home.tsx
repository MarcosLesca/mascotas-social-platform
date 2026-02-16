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
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mixedRecentCards.map((item) => {
                if (item.kind === "donation") {
                  const campaign = item.campaign;
                  return (
                    <article
                      key={item.id}
                      onClick={() => setCurrentView(View.DONATIONS)}
                      className="group h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-sky-500/10 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {campaign.urgency && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                              URGENTE
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-white text-slate-800 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-xs">pets</span>
                            {campaign.petName}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <h3 className="text-lg sm:text-xl leading-tight font-bold group-hover:text-sky-500 transition-colors mb-2 line-clamp-2">
                          {campaign.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate mb-3">
                          {campaign.type === 'medical' ? 'Médica' : campaign.type === 'food' ? 'Alimento' : campaign.type === 'shelter' ? 'Refugio' : 'Campaña'}
                        </p>

                        <p className="text-sm text-black mb-4 line-clamp-2 leading-relaxed">
                          {campaign.description}
                        </p>

                        <div className="mt-auto space-y-3">
                          <div className="bg-sky-50 rounded-xl p-3 flex justify-between items-center">
                            <span className="text-xs font-bold text-sky-700">Meta</span>
                            <span className="text-base font-black text-sky-600">${campaign.goal.toLocaleString("es-AR")}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="material-symbols-outlined text-sm">event</span>
                            <span>Hasta: {campaign.deadline}</span>
                          </div>

                          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2">
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
                  <PetCard
                    key={item.id}
                    pet={pet}
                    onViewDetails={() =>
                      setCurrentView(isLost ? View.LOST_PETS : View.ADOPTION)
                    }
                  />
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

