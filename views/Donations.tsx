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
    <div className="max-w-7xl mx-auto px-6 py-2 space-y-6">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-black text-black">
          Cuando ayudás, ellos sienten esperanza
        </h1>
        <p className="text-xl text-accent-teal">
          Donaciones
        </p>
      </div>

      {/* Transparency Notice */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-4">
          <div className="size-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl text-red-500">warning</span>
          </div>
          <div>
            <h3 className="text-xl font-black mb-2 text-red-600 dark:text-red-400">IMPORTANTE</h3>
            <p className="text-black leading-relaxed">
              En Mascotas SJ <strong className="text-red-500">no administramos el dinero</strong> de las donaciones. Solo publicamos las necesidades
              y proporcionamos toda la información necesaria para que puedas donate directamente a los responsables de las mascotas.
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div>
        <h2 className="text-3xl font-black mb-8">Donaciones Activas</h2>
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
                      <span className="text-lg font-black text-primary">${campaign.goal.toLocaleString('es-AR')}</span>
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
