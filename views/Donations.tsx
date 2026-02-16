import React, { useEffect, useState } from "react";
import { DonationCampaign } from "../types";
import DonationModal from "../components/DonationModal";
import { fetchApprovedDonationCampaigns } from "../services/donationCampaignsService";
import ReportDonationCampaignModal from "../components/ReportDonationCampaignModal";

const Donations: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] =
    useState<DonationCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const loadCampaigns = () => {
    let cancelled = false;
    fetchApprovedDonationCampaigns().then(({ data, error: e }) => {
      if (cancelled) return;
      if (e) {
        setError(e.message);
        setLoading(false);
        return;
      }
      setCampaigns(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    const cancel = loadCampaigns();
    return cancel;
  }, []);

  const handleCampaignClick = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="text-center mt-4 sm:mt-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
          Cuando ayudás, ellos sienten esperanza
        </h1>
        <p className="text-lg sm:text-xl text-gray-800">Donaciones</p>
      </div>

      {/* Transparency Notice */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-4 sm:p-5 border border-red-200 dark:border-red-800">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="size-10 sm:size-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl text-red-500">
              warning
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black mb-2 text-red-600 dark:text-red-400">
              IMPORTANTE
            </h3>
            <p className="text-sm sm:text-base text-black leading-relaxed">
              En Mascotas SJ{" "}
              <strong className="text-red-500">
                no administramos el dinero
              </strong>{" "}
              de las donaciones. Solo publicamos las necesidades y
              proporcionamos toda la información necesaria para que puedas
              donate directamente a los responsables de las mascotas.
            </p>
          </div>
        </div>
      </div>

      {/* Report CTA */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black">Publicar campana de donacion</h3>
          <p className="text-sm text-gray-800 mt-1">
            Carga los datos y la imagen. Se publicara una vez aprobada por admin.
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-background-dark font-black px-8 py-3 rounded-xl transition-colors"
        >
          COMENZAR
        </button>
      </div>

      {/* Campaigns Grid */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8">Donaciones Activas</h2>

        {submitMessage && (
          <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-accent-teal">
            {submitMessage}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-urgent-red/30 bg-urgent-red/10 p-4 text-urgent-red"
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-accent-teal font-medium">Cargando campaÃ±as...</p>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-accent-teal/10 bg-white dark:bg-white/5 p-6 sm:p-8 text-center">
            <h3 className="text-xl font-black">No hay campañas aprobadas</h3>
            <p className="text-sm text-gray-800 mt-2">
              Las nuevas campañas aparecerán aquí cuando sean aprobadas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {campaigns.map((campaign) => {
            return (
              <div
                key={campaign.id}
                onClick={() => handleCampaignClick(campaign)}
                className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-accent-teal/10 hover:border-primary/30 transition-all hover:shadow-2xl cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {campaign.urgency && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      URGENTE
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-xs font-medium mb-1">
                      <span className="material-symbols-outlined text-sm">
                        pets
                      </span>
                      {campaign.petName}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black mb-2 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Goal */}
                  <div className="bg-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-800 font-medium">
                        Meta:
                      </span>
                      <span className="text-base sm:text-lg font-black text-urgent-red">
                        ${campaign.goal.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-xs pt-2 border-t border-gray-200">
                    <span className="material-symbols-outlined text-sm">
                      event
                    </span>
                    <span className="font-medium text-gray-800">Hasta: </span>
                    <span className="font-medium text-urgent-red">
                      {campaign.deadline}
                    </span>
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-primary hover:bg-primary/90 text-background-dark text-sm sm:text-base font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    <span className="material-symbols-outlined text-lg">info</span>
                    Ver Información para Donar
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Donation Modal */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        variant="fullscreen"
      />

      <ReportDonationCampaignModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={() => {
          setSubmitMessage(
            "Campana enviada. Un administrador la revisara y, si se aprueba, aparecera en esta lista."
          );
          setShowReportModal(false);
          setTimeout(() => setSubmitMessage(null), 6000);
        }}
        onError={(message) => {
          setSubmitMessage(null);
          setError(message);
        }}
      />
    </div>
  );
};

export default Donations;
