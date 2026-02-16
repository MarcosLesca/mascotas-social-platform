import React, { useState, useRef, useEffect } from 'react';
import { submitLostPetReport } from '../services/lostPetsService';

interface ReportLostPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: unknown) => void;
  onError?: (message: string) => void;
}

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;

const ReportLostPetModal: React.FC<ReportLostPetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onError,
}) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: 'dog' as 'dog' | 'cat' | 'bird' | 'other',
    breed: '',
    gender: 'male' as 'male' | 'female',
    age: '',
    size: 'medium' as 'small' | 'medium' | 'large',
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
    rewardAmount: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.match(/^image\/(jpeg|png|webp)$/i)) {
      onError?.('Solo se permiten imágenes JPEG, PNG o WebP.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      onError?.(`La imagen no puede superar ${MAX_MB} MB.`);
      return;
    }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
    setSubmitError(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setSubmitError('Debes subir una foto de la mascota.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    const { error } = await submitLostPetReport({
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      gender: formData.gender,
      age: formData.age,
      size: formData.size,
      color: formData.color,
      distinctiveFeatures: formData.distinctiveFeatures,
      lastSeenDate: formData.lastSeenDate,
      lastSeenLocation: formData.lastSeenLocation,
      additionalInfo: formData.additionalInfo,
      urgency: formData.urgency,
      hasReward: formData.hasReward,
      rewardAmount: formData.rewardAmount,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      imageFile,
    });
    setIsSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      onError?.(error.message);
      return;
    }
    onSubmit?.(formData);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = !!(
    formData.petName.trim() &&
    formData.breed.trim() &&
    formData.color.trim() &&
    imageFile
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData({
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
        rewardAmount: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setCurrentStep(1);
      setSubmitError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-red-400 text-white p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-black">Reportar Mascota Perdida</h2>
            <button 
              onClick={onClose}
              className="px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/40 rounded-full text-xs sm:text-sm font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center overflow-x-auto gap-2 sm:gap-4">
            {[
              { step: 1, label: 'Información' },
              { step: 2, label: 'Detalles' },
              { step: 3, label: 'Contacto' }
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center flex-1 min-w-0 justify-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                  currentStep >= step 
                    ? 'bg-black text-white' 
                    : 'bg-white/30 text-black'
                }`}>
                  {step}
                </div>
                <span className={`ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium truncate ${
                  currentStep >= step ? 'text-white' : 'text-black'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 pb-24 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
          {/* Step 1: Pet Information */}
          {submitError && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-xl bg-red-400/10 dark:bg-red-400/20 border border-red-400/30 text-red-400 text-sm"
            >
              <span>{submitError}</span>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Información de la Mascota</h3>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Foto de la mascota *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_IMAGES}
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Subir foto de la mascota"
                />
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-40 h-40 object-cover rounded-xl border-2 border-red-400/20"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 px-2 py-1 bg-red-400 text-white rounded-full hover:bg-red-400/90 text-xs font-bold"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 w-40 h-40 rounded-xl border-2 border-dashed border-red-400/30 hover:border-red-400 hover:bg-red-400/5 transition-colors text-sm font-bold text-gray-800"
                  >
                    Subir foto
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-800">JPEG, PNG o WebP. Máx. {MAX_MB} MB.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="report-petName" className="block text-sm font-bold text-gray-800 mb-2">Nombre de la Mascota *</label>
                  <input
                    id="report-petName"
                    type="text"
                    required
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Ej: Buddy"
                  />
                </div>

                <div>
                  <label htmlFor="report-species" className="block text-sm font-bold text-gray-800 mb-2">Especie *</label>
                  <select
                    id="report-species"
                    value={formData.species}
                    onChange={(e) => handleInputChange('species', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                  >
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="bird">Ave</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Raza *</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Ej: Golden Retriever"
                  />
                </div>

                <div>
                  <label htmlFor="report-gender" className="block text-sm font-bold text-gray-800 mb-2">Género *</label>
                  <select
                    id="report-gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Edad Aproximada</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Ej: 3 años"
                  />
                </div>

                <div>
                  <label htmlFor="report-size" className="block text-sm font-bold text-gray-800 mb-2">Tamaño</label>
                  <select
                    id="report-size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                  >
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Color/Colores *</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                  placeholder="Ej: Dorado con manchas blancas"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Características Distintivas</label>
                <textarea
                  value={formData.distinctiveFeatures}
                  onChange={(e) => handleInputChange('distinctiveFeatures', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
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
                  <label htmlFor="report-lastSeenDate" className="block text-sm font-bold text-gray-800 mb-2">Fecha en que se perdió *</label>
                  <input
                    id="report-lastSeenDate"
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.lastSeenDate}
                    onChange={(e) => handleInputChange('lastSeenDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label htmlFor="report-lastSeenLocation" className="block text-sm font-bold text-gray-800 mb-2">Zona/Barrio donde se perdió *</label>
                  <input
                    id="report-lastSeenLocation"
                    type="text"
                    required
                    value={formData.lastSeenLocation}
                    onChange={(e) => handleInputChange('lastSeenLocation', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Ej: Parque Oakwood, entrada Calle 5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="report-additionalInfo" className="block text-sm font-bold text-gray-800 mb-2">Información Adicional</label>
                <textarea
                  id="report-additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
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
                    className="rounded text-primary focus:ring-red-400 border-red-400/20"
                  />
                  <span className="font-medium">Marcar como búsqueda urgente</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasReward}
                    onChange={(e) => handleInputChange('hasReward', e.target.checked)}
                    className="rounded text-primary focus:ring-red-400 border-red-400/20"
                  />
                  <span className="font-medium">Ofrecer recompensa</span>
                </label>

                {formData.hasReward && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Monto de la recompensa</label>
                    <input
                      type="text"
                      value={formData.rewardAmount}
                      onChange={(e) => handleInputChange('rewardAmount', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
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
                  <label className="block text-sm font-bold text-gray-800 mb-2">Tu Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="Ej: +54 9 11 2345-6789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-red-400/10 rounded-xl focus:ring-2 focus:ring-red-400"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800/30">
                <div className="flex gap-3">
                  <div>
                    <h4 className="font-bold mb-2">Importante</h4>
                    <ul className="text-sm text-black space-y-1">
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
          <div className="flex justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-red-400/10">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-sm ${
                currentStep === 1
                  ? 'text-gray-800/40 cursor-not-allowed'
                  : 'text-gray-800 hover:text-primary'
              }`}
            >
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={currentStep === 1 && !canProceedStep1}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-red-400 text-white rounded-lg sm:rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-red-400 text-white rounded-lg sm:rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLostPetModal;