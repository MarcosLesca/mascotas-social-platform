import React, { useState } from 'react';
import { DonationCampaign } from '../types';

interface DonationModalProps {
  campaign: DonationCampaign | null;
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ campaign, isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
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
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
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
              <p className="text-xs text-accent-teal font-medium mb-1">Meta de la Campaña</p>
              <p className="text-2xl font-black text-primary">${campaign.goal.toLocaleString('es-AR')}</p>
            </div>
          </div>
        </div>

        {/* Donation Information */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-6">
          {/* Pet Information */}
          <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">pets</span>
              <h3 className="text-xl font-black">Información de la Mascota</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-accent-teal font-medium block mb-1">Motivo de la Donación:</span>
                <p className="text-sm leading-relaxed">{campaign.description}</p>
              </div>
              <div className="flex justify-between pt-2 border-t border-accent-teal/10">
                <span className="text-accent-teal font-medium text-sm">Nombre:</span>
                <span className="font-bold text-sm">{campaign.petName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-teal font-medium text-sm">Responsable:</span>
                <span className="font-bold text-sm">{campaign.responsibleName}</span>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">account_balance</span>
              <h3 className="text-xl font-black">Información Bancaria</h3>
            </div>

            <div className="space-y-4">
              {/* CBU */}
              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">CBU</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl font-mono text-sm">
                    {campaign.cbu}
                  </div>
                  <button
                    onClick={() => handleCopy(campaign.cbu, 'cbu')}
                    className="px-4 py-3 bg-primary hover:bg-primary/90 text-background-dark rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {copiedField === 'cbu' ? 'check' : 'content_copy'}
                    </span>
                    {copiedField === 'cbu' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Alias */}
              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">Alias</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl font-mono text-sm">
                    {campaign.alias}
                  </div>
                  <button
                    onClick={() => handleCopy(campaign.alias, 'alias')}
                    className="px-4 py-3 bg-primary hover:bg-primary/90 text-background-dark rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {copiedField === 'alias' ? 'check' : 'content_copy'}
                    </span>
                    {copiedField === 'alias' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Account Holder */}
              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">Titular de la Cuenta</label>
                <div className="px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl">
                  {campaign.accountHolder}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-primary">contact_phone</span>
              <h3 className="text-xl font-black">Información de Contacto</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl">
                {campaign.contactInfo}
              </div>
              <button
                onClick={() => handleCopy(campaign.contactInfo, 'contact')}
                className="px-4 py-3 bg-primary hover:bg-primary/90 text-background-dark rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  {copiedField === 'contact' ? 'check' : 'content_copy'}
                </span>
                {copiedField === 'contact' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-2xl p-6 border border-accent-teal/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">event</span>
              <div>
                <h3 className="font-bold text-sm text-accent-teal">Fecha Límite</h3>
                <p className="text-lg font-black">{campaign.deadline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
