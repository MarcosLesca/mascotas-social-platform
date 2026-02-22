import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroZoom from "../components/home/HeroZoom";
import { fetchApprovedLostPets } from "../services/lostPetsService";
import { fetchApprovedAdoptionPets } from "../services/adoptionPetsService";
import { fetchApprovedDonationCampaigns } from "../services/donationCampaignsService";
import { useApp } from "../context/AppContext";
import type { Pet, DonationCampaign } from "../types";
import { View } from "../types";
import PetCard from "../components/PetCard";
import ShareModal from "../components/ShareModal";

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
  const navigate = useNavigate();
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingCampaign, setSharingCampaign] = useState<DonationCampaign | null>(null);

  // Helper for navigation
  const handleNavigate = (view: View) => {
    const viewPaths: Record<View, string> = {
      [View.HOME]: '/',
      [View.LOST_PETS]: '/lost-pets',
      [View.ADOPTION]: '/adoption',
      [View.DONATIONS]: '/donations',
      [View.FAQ]: '/faq',
      [View.ABOUT_US]: '/about-us',
    };
    navigate(viewPaths[view]);
    setCurrentView(view);
  };

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
        onToast("No se pudieron cargar las donaciones.", "error");
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

    return cards.slice(0, 8);
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
                Aún no hay casos publicados
              </h3>
              <p className="text-gray-800 text-sm mt-2">
                Sé el primero en crear una publicación.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
              {mixedRecentCards.map((item) => {
                if (item.kind === "donation") {
                  const campaign = item.campaign;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(View.DONATIONS)}
                      className="group h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-sky-500/10 hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Donación
                          </span>
                          {campaign.urgency && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                              Urgente
                            </span>
                          )}
                        </div>
                        {/* Share Button */}
                        <div className="absolute bottom-3 right-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSharingCampaign(campaign);
                              setShareModalOpen(true);
                            }}
                            className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                            style={{ backgroundColor: '#203553', color: '#ecdbbd' }}
                          >
                            Compartir
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-5 flex flex-col flex-1">
                        <h3 className="text-base sm:text-xl leading-tight font-bold group-hover:text-sky-500 transition-colors mb-1 sm:mb-2 line-clamp-2">
                          {campaign.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate mb-2 sm:mb-3">
                          {campaign.type === "medical"
                            ? "Médica"
                            : campaign.type === "food"
                              ? "Alimento"
                              : campaign.type === "shelter"
                                ? "Refugio"
                                : "Campaña"}
                        </p>

                        <p className="text-xs sm:text-sm text-black mb-2 sm:mb-4 line-clamp-2 leading-relaxed">
                          {campaign.description}
                        </p>

                        <div className="mt-auto space-y-2 sm:space-y-3">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-400">
                              Meta
                            </span>
                            <span className="text-xs sm:text-sm font-black text-green-600 dark:text-green-400">
                              ${campaign.goal.toLocaleString("es-AR")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-red-500 font-semibold">
                            <span className="material-symbols-outlined text-xs sm:text-base">
                              event
                            </span>
                            <span>Hasta: {campaign.deadline}</span>
                          </div>

                          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-full transition-all flex items-center justify-center gap-2">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                const pet = item.pet;
                const isLost = item.kind === "lost";

                // Use PetCard for pets - same as in LostPets and Adoption pages
                return (
                  <PetCard
                    key={item.id}
                    pet={pet}
                    onAction={(pet, action) => {
                      if (action === "view") {
                        handleNavigate(isLost ? View.LOST_PETS : View.ADOPTION);
                      }
                    }}
                    onViewDetails={() => {
                      handleNavigate(isLost ? View.LOST_PETS : View.ADOPTION);
                    }}
                  />
                );
              })}
            </section>
          )}
        </div>
      </div>

      {/* Share Modal for Donations */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSharingCampaign(null);
        }}
        item={sharingCampaign ? {
          id: sharingCampaign.id,
          image: sharingCampaign.image,
          title: sharingCampaign.title,
          description: sharingCampaign.description,
          type: 'donation',
        } : { id: '', image: '', title: '', description: '', type: 'donation' }}
        type="donation"
      />
    </>
  );
};

export default Home;

