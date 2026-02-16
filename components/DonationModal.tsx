import React from 'react';
import { DonationCampaign } from '../types';

interface DonationModalProps {
  campaign: DonationCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'modal' | 'fullscreen';
}

const DonationModal: React.FC<DonationModalProps> = ({ campaign, isOpen, onClose, variant = 'modal' }) => {
  const normalizedWhatsapp = (campaign?.whatsappNumber || '').replace(/\D/g, '');
  const hasWhatsapp = normalizedWhatsapp.length > 0;
  const hasEmail = Boolean(campaign?.contactEmail);

  if (!isOpen || !campaign) return null;

  const isFullscreen = variant === 'fullscreen';

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-background-dark overflow-y-auto"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm";

  const contentClasses = isFullscreen
    ? "w-full min-h-screen bg-white dark:bg-background-dark"
    : "bg-white dark:bg-background-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl";

  return (
    <div className={containerClasses} onClick={!isFullscreen ? onClose : undefined}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <button
            onClick={onClose}
            className={`absolute top-4 ${isFullscreen ? 'left-4' : 'right-4'} p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors flex items-center gap-2 px-4`}
          >
            {isFullscreen && <span className="material-symbols-outlined text-xl">arrow_back</span>}
            <span className={isFullscreen ? "font-bold text-sm" : "material-symbols-outlined text-xl"}>
              {isFullscreen ? 'Volver' : 'close'}
            </span>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-black text-white mb-2">{campaign.title}</h2>
          </div>
        </div>

        {/* Campaign Goal */}
        <div className="p-6 bg-accent-teal/5 border-b border-accent-teal/10">
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">flag</span>
            <div className="text-center">
              <p className="text-xs text-black font-medium mb-1">Meta de la Campaña</p>
              <p className="text-2xl font-black text-black">${campaign.goal.toLocaleString('es-AR')}</p>
            </div>
          </div>
        </div>

        {/* Donation Information */}
        <div className={`p-6 space-y-6 ${!isFullscreen ? 'max-h-[50vh] overflow-y-auto' : ''}`}>
          {/* Pet Information */}
          <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">pets</span>
              <h3 className="text-xl font-black text-black">Información de la Mascota</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-black font-medium block mb-1">Motivo de la Donación:</span>
                <p className="text-sm leading-relaxed text-black">{campaign.description}</p>
              </div>
              <div className="flex justify-between pt-2 border-t border-accent-teal/10">
                <span className="text-black font-medium text-sm">Nombre:</span>
                <span className="font-bold text-sm text-black">{campaign.petName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black font-medium text-sm">Responsable:</span>
                <span className="font-bold text-sm text-black">{campaign.responsibleName}</span>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">account_balance</span>
              <h3 className="text-xl font-black text-black">Información Bancaria</h3>
            </div>

            <div className="space-y-4">
              {/* CBU */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">CBU</label>
                <div className="px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl font-mono text-sm text-black">
                  {campaign.cbu}
                </div>
              </div>

              {/* Alias */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">Alias</label>
                <div className="px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl font-mono text-sm text-black">
                  {campaign.alias}
                </div>
              </div>

              {/* Account Holder */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">Titular de la Cuenta</label>
                <div className="px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl text-black">
                  {campaign.accountHolder}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">contact_phone</span>
              <h3 className="text-xl font-black text-black">Información de Contacto</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={hasWhatsapp ? `https://wa.me/${normalizedWhatsapp}` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    hasWhatsapp
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500 pointer-events-none'
                  }`}
                >

                  WhatsApp
                </a>
                <a
                  href={hasEmail ? `mailto:${campaign.contactEmail}` : undefined}
                  className={`px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    hasEmail
                      ? 'bg-sky-500 hover:bg-sky-600 text-white'
                      : 'bg-gray-200 text-gray-500 pointer-events-none'
                  }`}
                >

                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">event</span>
              <div>
                <h3 className="font-bold text-sm text-black">Fecha Límite</h3>
                <p className="text-lg font-black text-black">{campaign.deadline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
