import React, { useState } from 'react';

interface ReportLostPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const ReportLostPetModal: React.FC<ReportLostPetModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: 'dog',
    breed: '',
    gender: 'male',
    age: '',
    size: 'medium',
    color: '',
    distinctiveFeatures: '',
    lastSeenDate: '',
    lastSeenLocation: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    additionalInfo: '',
    urgency: false,
    hasReward: false,
    rewardAmount: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Report submitted:', formData);
    onSubmit?.(formData);
    setIsSubmitting(false);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-background-dark p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black">Reportar Mascota Perdida</h2>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Información de la Mascota' },
              { step: 2, label: 'Detalles de la Pérdida' },
              { step: 3, label: 'Contacto' }
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= step 
                    ? 'bg-white text-primary' 
                    : 'bg-white/20 text-white/60'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-white' : 'text-white/60'
                }`}>
                  {label}
                </span>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    currentStep > step ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Pet Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Información de la Mascota</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Nombre de la Mascota *</label>
                  <input
                    type="text"
                    required
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Buddy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Especie *</label>
                  <select
                    value={formData.species}
                    onChange={(e) => handleInputChange('species', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="bird">Ave</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Raza *</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Golden Retriever"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Género *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Edad Aproximada</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: 3 años"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Tamaño</label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">Color/Colores *</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Dorado con manchas blancas"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">Características Distintivas</label>
                <textarea
                  value={formData.distinctiveFeatures}
                  onChange={(e) => handleInputChange('distinctiveFeatures', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Ej: Cicatriz en la oreja izquierda, collar rojo con placa..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Loss Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Detalles de la Pérdida</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Fecha en que se perdió *</label>
                  <input
                    type="date"
                    required
                    value={formData.lastSeenDate}
                    onChange={(e) => handleInputChange('lastSeenDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Ubicación donde se perdió *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastSeenLocation}
                    onChange={(e) => handleInputChange('lastSeenLocation', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Parque Oakwood, entrada Calle 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">Información Adicional</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Circunstancias de la pérdida, comportamiento, salud, etc..."
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.checked)}
                    className="rounded text-primary focus:ring-primary border-accent-teal/20"
                  />
                  <span className="font-medium">Marcar como búsqueda urgente</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasReward}
                    onChange={(e) => handleInputChange('hasReward', e.target.checked)}
                    className="rounded text-primary focus:ring-primary border-accent-teal/20"
                  />
                  <span className="font-medium">Ofrecer recompensa</span>
                </label>

                {formData.hasReward && (
                  <div>
                    <label className="block text-sm font-bold text-accent-teal mb-2">Monto de la recompensa</label>
                    <input
                      type="text"
                      value={formData.rewardAmount}
                      onChange={(e) => handleInputChange('rewardAmount', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                      placeholder="Ej: $5000"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Tu Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-accent-teal mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: +54 9 11 2345-6789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-accent-teal mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800/30">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-2xl">info</span>
                  <div>
                    <h4 className="font-bold mb-2">Importante</h4>
                    <ul className="text-sm text-accent-teal space-y-1">
                      <li>• Tu información será visible para quienes vean el reporte</li>
                      <li>• Te contactaremos directamente si alguien tiene información</li>
                      <li>• Puedes actualizar o eliminar el reporte en cualquier momento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-accent-teal/10">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                currentStep === 1
                  ? 'text-accent-teal/40 cursor-not-allowed'
                  : 'text-accent-teal hover:text-primary'
              }`}
            >
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-primary text-background-dark rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-background-dark rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar Reporte'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLostPetModal;