import React, { useState, useRef, useEffect } from 'react';
import { submitAdoptionPetReport } from '../services/adoptionPetsService';

interface ReportAdoptionPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: unknown) => void;
  onError?: (message: string) => void;
}

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;
const MED_STATUS_OPTIONS = ['Vacunado', 'Esterilizado', 'Desparasitado'];

const ReportAdoptionPetModal: React.FC<ReportAdoptionPetModalProps> = ({
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
    location: '',
    description: '',
    adoptionRequirements: '',
    medStatus: [] as string[],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll al inicio cuando cambia el paso
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  }, [currentStep]);
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
      onError?.('Solo se permiten imÃ¡genes JPEG, PNG o WebP.');
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

  const toggleMedStatus = (value: string) => {
    setFormData(prev => ({
      ...prev,
      medStatus: prev.medStatus.includes(value)
        ? prev.medStatus.filter(s => s !== value)
        : [...prev.medStatus, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setSubmitError('Debes subir una foto de la mascota.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    const { error } = await submitAdoptionPetReport({
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      gender: formData.gender,
      age: formData.age,
      size: formData.size,
      color: formData.color,
      location: formData.location,
      description: formData.description,
      adoptionRequirements: formData.adoptionRequirements,
      medStatus: formData.medStatus,
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

  const canProceedStep2 = !!formData.location.trim();

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
        location: '',
        description: '',
        adoptionRequirements: '',
        medStatus: [],
        contactName: '',
        contactPhone: '',
        contactEmail: '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-background-dark p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black">Publicar en Adopción</h2>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white/20 hover:bg-white/40 rounded-full text-sm font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'InformaciÃ³n de la Mascota' },
              { step: 2, label: 'Detalles de AdopciÃ³n' },
              { step: 3, label: 'Contacto' },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step ? 'bg-white text-primary' : 'bg-white/20 text-white/60'
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {label}
                </span>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      currentStep > step ? 'bg-white' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-8 max-h-[60vh] overflow-y-auto">
          {submitError && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 border border-urgent-red/30 text-urgent-red text-sm"
            >
              <span>{submitError}</span>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Información de la Mascota</h3>

              <div>
                <label className="block text-sm font-bold text-accent-teal mb-2">
                  Foto de la mascota *
                </label>
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
                      className="w-40 h-40 object-cover rounded-xl border-2 border-accent-teal/20"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 px-2 py-1 bg-urgent-red text-white rounded-full hover:bg-urgent-red/90 text-xs font-bold"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 w-40 h-40 rounded-xl border-2 border-dashed border-accent-teal/30 hover:border-primary hover:bg-primary/5 transition-colors text-sm font-bold text-accent-teal"
                  >
                    Subir foto
                  </button>
                )}
                <p className="mt-1 text-xs text-accent-teal">
                  JPEG, PNG o WebP. MÃ¡x. {MAX_MB} MB.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adopt-petName" className="block text-sm font-bold text-accent-teal mb-2">
                    Nombre de la Mascota *
                  </label>
                  <input
                    id="adopt-petName"
                    type="text"
                    required
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Buddy"
                  />
                </div>

                <div>
                  <label htmlFor="adopt-species" className="block text-sm font-bold text-accent-teal mb-2">
                    Especie *
                  </label>
                  <select
                    id="adopt-species"
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
                  <label htmlFor="adopt-gender" className="block text-sm font-bold text-accent-teal mb-2">
                    Género *
                  </label>
                  <select
                    id="adopt-gender"
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
                    placeholder="Ej: 3 aÃ±os"
                  />
                </div>

                <div>
                  <label htmlFor="adopt-size" className="block text-sm font-bold text-accent-teal mb-2">
                    Tamaño
                  </label>
                  <select
                    id="adopt-size"
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Detalles de Adopción</h3>

              <div>
                <label htmlFor="adopt-location" className="block text-sm font-bold text-accent-teal mb-2">
                  Zona/Barrio *
                </label>
                <input
                  id="adopt-location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Barrio Las Palmeras"
                />
              </div>

              <div>
                <label htmlFor="adopt-description" className="block text-sm font-bold text-accent-teal mb-2">
                  Descripción
                </label>
                <textarea
                  id="adopt-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Personalidad, historia, convivencia, etc..."
                />
              </div>

              <div>
                <p className="text-sm font-bold text-accent-teal mb-3">Estado Médico</p>
                <div className="flex flex-wrap gap-3">
                  {MED_STATUS_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.medStatus.includes(option)}
                        onChange={() => toggleMedStatus(option)}
                        className="rounded text-primary focus:ring-primary border-accent-teal/20"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="adopt-requirements" className="block text-sm font-bold text-accent-teal mb-2">
                  Requisitos de adopción
                </label>
                <textarea
                  id="adopt-requirements"
                  value={formData.adoptionRequirements}
                  onChange={(e) => handleInputChange('adoptionRequirements', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Ej: Contrato, visita previa, patio cerrado..."
                />
              </div>
            </div>
          )}

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
                  <label className="block text-sm font-bold text-accent-teal mb-2">TelÃ©fono *</label>
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
                  <div>
                    <h4 className="font-bold mb-2">Importante</h4>
                    <ul className="text-sm text-black space-y-1">
                      <li>• Tu información será visible en la publicación aprobada</li>
                      <li>• Los interesados te contactarán directamente</li>
                      <li>• Podemos pausar o eliminar la publicación si lo solicitás</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-accent-teal/10">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                currentStep === 1 ? 'text-accent-teal/40 cursor-not-allowed' : 'text-accent-teal hover:text-primary'
              }`}
            >
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)}
                className="px-8 py-3 bg-primary text-background-dark rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-background-dark rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ReportAdoptionPetModal;
