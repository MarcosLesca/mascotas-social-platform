import React, { useEffect, useMemo, useState } from "react";
import { MOCK_CAMPAIGNS } from "../constants";
import HeroZoom from "../components/home/HeroZoom";
import { fetchApprovedLostPets } from "../services/lostPetsService";
import { fetchApprovedAdoptionPets } from "../services/adoptionPetsService";
import { useApp } from "../context/AppContext";
import type { Pet, DonationCampaign } from "../types";
import { View } from "../types";

interface HomeProps {
  onToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
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
        onToast(
          "No se pudieron cargar las ultimas mascotas perdidas.",
          "error",
        );
      } else {
        setLostPets(lostRes.data);
      }

      if (adoptionRes.error) {
        onToast("No se pudieron cargar las mascotas en adopcion.", "error");
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

  const latestLost = lostPets.slice(0, 6);
  const latestAdoption = adoptionPets.slice(0, 6);
  const latestDonations = MOCK_CAMPAIGNS.slice(0, 6);

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

      <div
        className="relative px-4 md:px-10 lg:px-20 py-12"
        style={{ marginTop: "200vh" }}
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Publicaciones recientes:
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
              <button
                onClick={() => setCurrentView(View.LOST_PETS)}
                className="rounded-xl border border-accent-teal/20 px-4 py-3 text-xs font-black uppercase hover:border-primary"
              >
                Perdidos
              </button>
              <button
                onClick={() => setCurrentView(View.ADOPTION)}
                className="rounded-xl border border-accent-teal/20 px-4 py-3 text-xs font-black uppercase hover:border-primary"
              >
                Adopcion
              </button>
              <button
                onClick={() => setCurrentView(View.DONATIONS)}
                className="rounded-xl border border-accent-teal/20 px-4 py-3 text-xs font-black uppercase hover:border-primary"
              >
                Donaciones
              </button>
            </div>
          </section>

          {loading && mixedRecentCards.length === 0 ? (
            <p className="text-accent-teal text-sm">
              Cargando publicaciones recientes...
            </p>
          ) : mixedRecentCards.length === 0 ? (
            <div className="rounded-3xl border border-accent-teal/10 bg-white dark:bg-white/5 p-8 text-center">
              <h3 className="text-xl font-black">
                Sin publicaciones recientes
              </h3>
              <p className="text-accent-teal text-sm mt-2">
                Todavia no hay datos para mostrar en el feed.
              </p>
            </div>
          ) : (
            <section className="columns-1 md:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
              {mixedRecentCards.map((item, index) => {
                const imageHeightClass =
                  index % 4 === 0
                    ? "h-64"
                    : index % 3 === 0
                      ? "h-44"
                      : index % 2 === 0
                        ? "h-56"
                        : "h-52";

                if (item.kind === "donation") {
                  const campaign = item.campaign;
                  return (
                    <article
                      key={item.id}
                      onClick={() => setCurrentView(View.DONATIONS)}
                      className="mb-6 break-inside-avoid rounded-3xl overflow-hidden border border-accent-teal/15 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/40 hover:shadow-xl transition-all"
                    >
                      <div
                        className={`relative ${imageHeightClass} overflow-hidden`}
                      >
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-3 left-3 bg-primary text-background-dark text-[10px] px-2 py-1 rounded-full font-black uppercase">
                          Donacion
                        </span>
                        {campaign.urgency && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black uppercase">
                            Urgente
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-black leading-tight">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-accent-teal line-clamp-3">
                          {campaign.description}
                        </p>
                        <div className="pt-2 border-t border-accent-teal/10 text-xs text-accent-teal">
                          <p className="font-bold">
                            Meta: ${campaign.goal.toLocaleString("es-AR")}
                          </p>
                          <p>Hasta: {campaign.deadline}</p>
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
                    onClick={() =>
                      setCurrentView(isLost ? View.LOST_PETS : View.ADOPTION)
                    }
                    className="mb-6 break-inside-avoid rounded-3xl overflow-hidden border border-accent-teal/15 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/40 hover:shadow-xl transition-all"
                  >
                    <div
                      className={`relative ${imageHeightClass} overflow-hidden`}
                    >
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      <span
                        className={`absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                          isLost
                            ? "bg-rose-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {isLost ? "Perdido" : "Adopcion"}
                      </span>
                      {isLost && pet.urgency && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black uppercase">
                          Urgente
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-black">{pet.name}</h3>
                      <p className="text-sm text-accent-teal">
                        {pet.breed} � {pet.location}
                      </p>
                      {pet.description && (
                        <p className="text-sm text-accent-teal line-clamp-3">
                          {pet.description}
                        </p>
                      )}
                      <div className="pt-2 border-t border-accent-teal/10 text-xs text-accent-teal">
                        {isLost ? (
                          <p>{pet.timeLabel || "Reporte reciente"}</p>
                        ) : (
                          <p>{pet.age || "Edad no especificada"}</p>
                        )}
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
