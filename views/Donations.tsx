import React, { useEffect, useState, useMemo } from "react";
import { DonationCampaign } from "../types";
import DonationModal from "../components/DonationModal";
import { fetchApprovedDonationCampaigns } from "../services/donationCampaignsService";
import ReportDonationCampaignModal from "../components/ReportDonationCampaignModal";

interface DonationFilters {
  type: string[];
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
    type: [],
    urgency: false,
    searchTerm: ''
  });

  const loadCampaigns = () => {
    let cancelled = false;
    setLoading(true);
    fetchApprovedDonationCampaigns().then(({ data, error: e }) => {
      if (cancelled) return;
      setLoading(false);
      if (e) {
        setError(e.message);
        return;
      }
      setCampaigns(data);
    });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    const cancel = loadCampaigns();
    return cancel;
  }, []);

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower) ||
        campaign.petName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type.length > 0) {
      filtered = filtered.filter(campaign => filters.type.includes(campaign.type));
    }

    if (filters.urgency) {
      filtered = filtered.filter(campaign => campaign.urgency);
    }

    return filtered;
  }, [campaigns, filters]);

  const clearFilters = () => {
    setFilters({
      type: [],
      urgency: false,
      searchTerm: ''
    });
  };

  const hasActiveFilters = filters.type.length > 0 || filters.urgency || !!filters.searchTerm;

  const handleCampaignClick = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-6 sm:pb-10 flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mt-4 sm:mt-6 px-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 text-black">
          Cuando ayudás, ellos sienten esperanza
        </h1>
        <p className="text-gray-800 text-base sm:text-lg">Donaciones</p>
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
              donar directamente a los responsables de las mascotas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-1 xl:col-span-3">
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-sky-500/10 xl:sticky xl:top-24">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold">Filtros</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] sm:text-xs font-bold text-sky-500 hover:underline"
                >
                  LIMPIAR
                </button>
              )}
            </div>

            {/* Búsqueda */}
            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-white/10 border border-sky-500/20 rounded-xl focus:ring-2 focus:ring-sky-500 text-sm"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Tipo</p>
                <div className="flex flex-wrap gap-2">
                  {['Médica', 'Alimento', 'Refugio', 'Esterilización', 'Emergencia', 'Otro'].map(t => {
                    const typeMap: { [key: string]: string } = { 'Médica': 'medical', 'Alimento': 'food', 'Refugio': 'shelter', 'Esterilización': 'spay_neuter', 'Emergencia': 'emergency', 'Otro': 'other' };
                    const typeValue = typeMap[t];
                    const isSelected = filters.type.includes(typeValue);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(typeValue)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-sky-500/5 text-gray-800 hover:bg-sky-500/10'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Urgencia</p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.urgency}
                    onChange={(e) => setFilters({ ...filters, urgency: e.target.checked })}
                    className="rounded text-sky-500 focus:ring-sky-500 border-sky-500/20"
                  />
                  <span className="text-sm font-medium group-hover:text-sky-500 transition-colors">
                    Mostrar solo urgentes
                  </span>
                </label>
              </div>
            </div>

            <button className="w-full mt-8 sm:mt-10 bg-sky-500 text-white py-3.5 sm:py-4 rounded-2xl font-black shadow-lg shadow-sky-500/20 hover:scale-[1.02] transition-all">
              {filteredCampaigns.length} Campañas
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="col-span-1 xl:col-span-9">
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
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
              <p className="text-gray-800 text-sm sm:text-base font-medium">Cargando campañas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Report Campaign Card - First Position */}
              <div
                className="bg-sky-500/5 dark:bg-sky-500/10 border-4 border-dashed border-sky-500/20 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center group cursor-pointer hover:bg-sky-500/10 transition-all min-h-[300px] sm:min-h-[380px]"
                onClick={() => setShowReportModal(true)}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">Publicar campaña</h3>
                <p className="text-sm text-gray-600 mb-6 sm:mb-8 max-w-[220px]">
                  Carga los datos y la imagen. Se publicará una vez aprobada.
                </p>
                <button
                  className="bg-sky-500 text-white w-full md:w-auto px-6 sm:px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-sky-500/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReportModal(true);
                  }}
                >
                  COMENZAR
                </button>
              </div>

              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign)}
                  className="group h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-sky-500/10 hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
                >
                  {/* Image */}
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

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-lg sm:text-xl leading-tight font-bold group-hover:text-sky-500 transition-colors mb-2 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide truncate mb-3">
                      {/* Using goal as secondary info akin to breed/gender if needed, else description */}
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
                </div>
              ))}
            </div>
          )}

          {!loading && hasActiveFilters && filteredCampaigns.length === 0 && (
            <div className="bg-white dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-sky-500/5 p-6 sm:p-10 lg:p-12 text-center mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">No encontramos resultados</h3>
              <p className="text-sm sm:text-base text-gray-800 mb-6">Intenta ajustar los filtros o el término de búsqueda</p>
              <button onClick={clearFilters} className="bg-sky-500 text-white w-full sm:w-auto px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

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
            "Campaña enviada. Un administrador la revisará y, si se aprueba, aparecerá en esta lista."
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
