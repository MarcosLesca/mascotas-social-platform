import React, { useEffect, useState, useMemo } from "react";
import { DonationCampaign } from "../types";
import DonationModal from "../components/DonationModal";
import { fetchApprovedDonationCampaigns } from "../services/donationCampaignsService";
import ReportDonationCampaignModal from "../components/ReportDonationCampaignModal";

interface DonationFilters {
  urgency: boolean;
  searchTerm: string;
}

const Donations: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] =
    useState<DonationCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<DonationFilters>({
    urgency: false,
    searchTerm: ''
  });

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

  // Filtrar campañas según los filtros seleccionados
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;

    // Filtro por búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower) ||
        campaign.petName.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por urgencia
    if (filters.urgency) {
      filtered = filtered.filter(campaign => campaign.urgency);
    }

    return filtered;
  }, [campaigns, filters]);

  const clearFilters = () => {
    setFilters({
      urgency: false,
      searchTerm: ''
    });
  };

  const hasActiveFilters = filters.urgency || filters.searchTerm;

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
          <p className="text-gray-900 font-medium">Cargando campañas...</p>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-accent-teal/10 bg-white dark:bg-white/5 p-6 sm:p-8 text-center">
            <h3 className="text-xl font-black">No hay campañas aprobadas</h3>
            <p className="text-sm text-gray-800 mt-2">
              Las nuevas campañas aparecerán aquí cuando sean aprobadas.
            </p>
          </div>
        ) : (
          <>
            {/* Filtros */}
            <div className="bg-white dark:bg-white/5 p-5 sm:p-6 rounded-2xl border border-sky-500/10 mb-6">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h3 className="text-lg font-bold">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-sky-500 hover:underline"
                  >
                    LIMPIAR
                  </button>
                )}
              </div>

              {/* Búsqueda */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción o mascota..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-sky-500/10 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.urgency}
                      onChange={(e) => setFilters({ ...filters, urgency: e.target.checked })}
                      className="rounded text-sky-500 focus:ring-sky-500 border-sky-500/20"
                    />
                    <span className="text-sm font-medium">Solo urgentes</span>
                  </label>
                </div>
              </div>

              <button className="w-full mt-4 bg-sky-500 text-white py-3 rounded-xl font-black shadow-lg shadow-sky-500/20">
                {filteredCampaigns.length} Campañas
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Report Campaign Card - First Position */}
            <div
              className="bg-sky-500/5 dark:bg-sky-500/10 border-4 border-dashed border-sky-500/20 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center group cursor-pointer hover:bg-sky-500/10 transition-all min-h-[300px] sm:min-h-[380px]"
              onClick={() => setShowReportModal(true)}
            >
              <h3 className="text-xl font-bold mb-3">Publicar campaña de donación</h3>
              <p className="text-sm text-gray-800 mb-8 max-w-[220px]">
                Carga los datos y la imagen. Se publicará una vez aprobada.
              </p>
              <button
                className="w-full sm:w-auto bg-sky-500 text-white px-8 sm:px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-sky-500/30 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReportModal(true);
                }}
              >
                COMENZAR
              </button>
            </div>

            {filteredCampaigns.map((campaign) => {
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
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    <span className="material-symbols-outlined text-lg">info</span>
                    Ver Información para Donar
                  </button>
                </div>
              </div>
            );
          })}
          </div>
          </>
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
