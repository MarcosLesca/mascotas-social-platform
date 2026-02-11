import React, { useState } from 'react';
import { DonationCampaign } from '../types';
import { MOCK_CAMPAIGNS } from '../constants';
import DonationModal from '../components/DonationModal';

const Donations: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCampaignClick = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 bg-primary/10 rounded-3xl mb-4">
          <span className="material-symbols-outlined text-5xl text-primary">volunteer_activism</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent-teal bg-clip-text text-transparent">
          Donaciones y Solidaridad
        </h1>
        <p className="text-xl text-accent-teal max-w-3xl mx-auto leading-relaxed">
          Ayuda directamente a mascotas que necesitan tu apoyo. Todas las donaciones van directo a los responsables.
        </p>
      </div>

      {/* Transparency Notice */}
      <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-3xl p-8 border border-accent-teal/10">
        <div className="flex items-start gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl text-primary">verified</span>
          </div>
          <div>
            <h3 className="text-xl font-black mb-2">Donaciones Directas y Transparentes</h3>
            <p className="text-accent-teal leading-relaxed">
              En Mascotas SJ <strong>no administramos el dinero</strong> de las donaciones. Solo publicamos las necesidades
              y proporcionamos toda la información necesaria para que puedas donar directamente a los responsables de las mascotas.
              Cada campaña incluye el CBU/Alias, titular de la cuenta y datos de contacto verificados.
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div>
        <h2 className="text-3xl font-black mb-8">Campañas Activas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CAMPAIGNS.map((campaign) => {
            return (
              <div
                key={campaign.id}
                onClick={() => handleCampaignClick(campaign)}
                className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-accent-teal/10 hover:border-primary/30 transition-all hover:shadow-2xl cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {campaign.urgency && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">emergency</span>
                      URGENTE
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-xs font-medium mb-1">
                      <span className="material-symbols-outlined text-sm">pets</span>
                      {campaign.petName}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black mb-2 line-clamp-2">{campaign.title}</h3>
                    <p className="text-sm text-accent-teal line-clamp-2">{campaign.description}</p>
                  </div>

                  {/* Goal */}
                  <div className="bg-accent-teal/5 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent-teal font-medium">Meta:</span>
                      <span className="text-lg font-black text-primary">${campaign.goal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-xs text-accent-teal pt-2 border-t border-accent-teal/10">
                    <span className="material-symbols-outlined text-sm">event</span>
                    <span className="font-medium">Hasta: {campaign.deadline}</span>
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    <span className="material-symbols-outlined">info</span>
                    Ver Información para Donar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Donation Modal */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Donations;
