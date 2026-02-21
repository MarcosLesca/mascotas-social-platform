import React, { useEffect, useRef, useState } from 'react';
import { submitDonationCampaign } from '../services/donationCampaignsService';

interface ReportDonationCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  onError?: (message: string) => void;
}

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;

const ReportDonationCampaignModal: React.FC<ReportDonationCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    urgency: false,
    type: 'medical' as 'medical' | 'food' | 'shelter' | 'spay_neuter' | 'emergency' | 'other',
    petName: '',
    cbu: '',
    alias: '',
    accountHolder: '',
    responsibleName: '',
    whatsappNumber: '',
    contactEmail: '',
    deadline: '',
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      onError?.('Solo se permiten imágenes JPEG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onError?.(`La imagen no puede superar ${MAX_MB} MB.`);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setSubmitError('Debes subir una imagen de la donación.');
      return;
    }

    const goalValue = Number(formData.goal);
    if (!Number.isFinite(goalValue) || goalValue <= 0) {
      setSubmitError('La meta debe ser un número mayor a 0.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Valor por defecto para tipo si está vacío
    const typeValue = formData.type || 'medical';

    const { error } = await submitDonationCampaign({
      title: formData.title,
      description: formData.description,
      goal: goalValue,
      urgency: formData.urgency,
      type: typeValue,
      petName: formData.petName,
      cbu: formData.cbu,
      alias: formData.alias,
      accountHolder: formData.accountHolder,
      responsibleName: formData.responsibleName,
      whatsappNumber: formData.whatsappNumber,
      contactEmail: formData.contactEmail,
      deadline: formData.deadline,
      imageFile,
    });

    setIsSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      onError?.(error.message);
      return;
    }

    onSubmit?.();
    onClose();
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Evita envios implicitos al presionar Enter en inputs.
    if (e.key !== "Enter") return;
    const target = e.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    e.preventDefault();
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        goal: '',
        urgency: false,
        type: '',
        petName: '',
        cbu: '',
        alias: '',
        accountHolder: '',
        responsibleName: '',
        whatsappNumber: '',
        contactEmail: '',
        deadline: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setSubmitError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-sky-500 text-white p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-black">Publicar Donación</h2>
          <button
            onClick={onClose}
            className="px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/40 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="p-4 sm:p-6 max-h-[80vh] sm:max-h-[75vh] overflow-y-auto space-y-4 sm:space-y-5 mb-8 sm:mb-4"
        >
          {submitError && (
            <div
              role="alert"
              className="rounded-xl border border-urgent-red/30 bg-urgent-red/10 px-4 py-3 text-sm text-urgent-red"
            >
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Imagen de la donación *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_IMAGES}
              onChange={handleImageChange}
              className="hidden"
              aria-label="Subir imagen de donación"
            />
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-44 h-44 object-cover rounded-xl border-2 border-sky-500/20"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 px-2 py-1 bg-urgent-red text-white rounded-full hover:bg-urgent-red/90 text-xs font-bold cursor-pointer"
                >
                  X
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-44 h-44 rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-500 hover:bg-sky-500/5 transition-colors text-sm font-bold text-gray-900 cursor-pointer"
              >
                Subir imagen
              </button>
            )}
            <p className="mt-1 text-xs text-gray-900">JPEG, PNG o WebP. Max. {MAX_MB} MB.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Titulo *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                placeholder="Ej: Cirugía para Max"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mascota *</label>
              <input
                type="text"
                required
                value={formData.petName}
                onChange={e => handleInputChange('petName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                placeholder="Ej: Max"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Meta (ARS) *</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={formData.goal}
                onChange={e => handleInputChange('goal', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                placeholder="Ej: 200000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Tipo *</label>
              <select
                value={formData.type}
                onChange={e => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Seleccionar...</option>
                <option value="medical">Médica</option>
                <option value="food">Alimento</option>
                <option value="shelter">Refugio</option>
                <option value="spay_neuter">Esterilización</option>
                <option value="emergency">Emergencia</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Fecha límite *</label>
              <input
                type="date"
                required
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                value={formData.deadline}
                onChange={e => handleInputChange('deadline', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Descripcion *</label>
              <textarea
                required
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                rows={3}
                placeholder="Explica para qué es la donación."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">CBU *</label>
              <input
                type="text"
                required
                value={formData.cbu}
                onChange={e => handleInputChange('cbu', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Alias *</label>
              <input
                type="text"
                required
                value={formData.alias}
                onChange={e => handleInputChange('alias', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Titular *</label>
              <input
                type="text"
                required
                value={formData.accountHolder}
                onChange={e => handleInputChange('accountHolder', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Responsable *</label>
              <input
                type="text"
                required
                value={formData.responsibleName}
                onChange={e => handleInputChange('responsibleName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">WhatsApp *</label>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={formData.whatsappNumber}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d+]/g, "");
                  handleInputChange('whatsappNumber', value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                placeholder="Ej: 5491123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={e => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-500/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-sky-500"
                placeholder="Ej: contacto@ejemplo.com"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.urgency}
              onChange={e => handleInputChange('urgency', e.target.checked)}
              className="rounded text-sky-500 focus:ring-sky-500 border-sky-500/20"
            />
            <span className="text-sm font-medium">Marcar como urgente</span>
          </label>

          <div className="flex justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-sky-500/20 text-gray-900 font-bold hover:bg-sky-500/10 transition-colors text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-colors disabled:opacity-50 text-sm cursor-pointer"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDonationCampaignModal;
