import React, { useState } from 'react';
import { DonationCampaign } from '../types';

interface DonationModalProps {
  campaign: DonationCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  onDonate?: (amount: number, data: any) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ campaign, isOpen, onClose, onDonate }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    isAnonymous: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    const donationData = {
      amount: finalAmount,
      campaignId: campaign?.id,
      ...donorInfo
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Donation processed:', donationData);
    onDonate?.(finalAmount, donationData);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen || !campaign) return null;

  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  const remaining = campaign.goal - campaign.raised;

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
            <p className="text-white/90 text-sm">{campaign.description}</p>
          </div>
        </div>

        {/* Campaign Progress */}
        <div className="p-6 bg-accent-teal/5 border-b border-accent-teal/10">
          <div className="flex justify-between text-sm font-bold mb-3">
            <span className="text-primary">${campaign.raised.toLocaleString()} recaudados</span>
            <span className="text-accent-teal">Meta: ${campaign.goal.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full bg-accent-teal/10 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_#13ec5b] transition-all duration-500" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-accent-teal font-medium">
              {progressPercentage.toFixed(1)}% completado
            </span>
            <span className="text-xs font-bold text-primary">
              ${remaining.toLocaleString()} restantes
            </span>
          </div>
        </div>

        {/* Donation Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Amount Selection */}
            <div>
              <h3 className="text-lg font-bold mb-4">Selecciona el monto a donar</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-primary text-background-dark shadow-lg'
                        : 'bg-accent-teal/5 text-accent-teal hover:bg-accent-teal/10'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-teal font-bold">$</span>
                <input
                  type="number"
                  placeholder="Otro monto"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div>
              <h3 className="text-lg font-bold mb-4">Tus datos</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-accent-teal mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-accent-teal mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={donorInfo.phone}
                      onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                      placeholder="+54 9 11 2345-6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Mensaje (opcional)</label>
                  <textarea
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Deja un mensaje de apoyo..."
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorInfo.isAnonymous}
                    onChange={(e) => setDonorInfo({...donorInfo, isAnonymous: e.target.checked})}
                    className="rounded text-primary focus:ring-primary border-accent-teal/20"
                  />
                  <span className="font-medium">Donar de forma anónima</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-bold mb-4">Método de pago</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'credit_card', label: 'Tarjeta', method: 'card' },
                  { icon: 'account_balance', label: 'Transferencia', method: 'transfer' },
                  { icon: 'payments', label: 'Mercado Pago', method: 'mercadopago' },
                  { icon: 'currency_bitcoin', label: 'Cripto', method: 'crypto' }
                ].map(({ icon, label, method }) => (
                  <button
                    key={method}
                    type="button"
                    className="p-4 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl hover:border-primary transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-xl text-accent-teal">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800/30">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-green-500 text-xl">security</span>
                <div>
                  <h4 className="font-bold text-sm mb-1">Pago Seguro</h4>
                  <p className="text-xs text-accent-teal">
                    Tu donación está protegida con encriptación SSL. Recibirás un comprobante por email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-accent-teal/10">
            <button
              type="submit"
              disabled={isProcessing || (!selectedAmount && !customAmount)}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Procesando donación...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">volunteer_activism</span>
                  Donar ${customAmount || selectedAmount}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;