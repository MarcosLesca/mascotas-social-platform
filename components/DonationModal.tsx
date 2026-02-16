import React, { useState } from "react";
import { DonationCampaign } from "../types";
import ImageViewer from "./ImageViewer";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function normalizePhoneNumber(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("54")) {
    return "54" + digits.slice(2);
  }
  if (digits.startsWith("0")) {
    return "54" + digits.slice(1);
  }
  if (digits.length === 11) {
    return "54" + digits;
  }
  return "54" + digits;
}

interface DonationModalProps {
  campaign: DonationCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: "modal" | "fullscreen";
}

const DonationModal: React.FC<DonationModalProps> = ({
  campaign,
  isOpen,
  onClose,
  variant = "modal",
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!isOpen || !campaign) return null;

  const normalizedWhatsapp = normalizePhoneNumber(
    campaign.whatsappNumber || "",
  );
  const hasWhatsapp = !!campaign.whatsappNumber;
  const hasEmail = !!campaign.contactEmail;

  const waMessage = `Hola! Vi la donación "${campaign.title}" para ${campaign.petName} y me gustaría ayudar.`;
  const waHref = hasWhatsapp
    ? `https://wa.me/${normalizedWhatsapp}?text=${encodeURIComponent(waMessage)}`
    : null;

  const mailHref = hasEmail
    ? `mailto:${campaign.contactEmail}?subject=${encodeURIComponent(`Ayuda para ${campaign.petName}`)}&body=${encodeURIComponent(waMessage)}`
    : null;

  const isFullscreen = variant === "fullscreen";

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-background-dark overflow-y-auto"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm";

  const contentClasses = isFullscreen
    ? "w-full min-h-screen bg-white dark:bg-background-dark"
    : "bg-white dark:bg-background-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl";

  const typeLabel =
    {
      medical: "Médica",
      food: "Alimento",
      infrastructure: "Infraestructura",
    }[campaign.type] || campaign.type;

  return (
    <>
      <div
        className={containerClasses}
        onClick={!isFullscreen ? onClose : undefined}
      >
        <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
          {/* Header con imagen */}
          <div
            className="relative h-56 sm:h-72 overflow-hidden bg-black cursor-zoom-in group"
            onClick={() => setIsImageViewerOpen(true)}
          >
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-contain bg-black"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Zoom Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
              <div className="bg-black/30 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
                <span className="material-symbols-outlined text-white text-3xl">
                  zoom_in
                </span>
              </div>
            </div>

            {/* Botón cerrar / volver */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={`absolute top-4 ${isFullscreen ? "left-4" : "right-4"} z-10 px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-full text-sm font-black transition-all shadow-lg flex items-center gap-2`}
            >
              {isFullscreen && (
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
              )}
              {isFullscreen ? "Volver" : "Cerrar"}
            </button>

            {/* Badges */}
            <div className="absolute bottom-6 left-6 flex gap-3 flex-wrap pointer-events-none">
              {campaign.urgency && (
                <span className="bg-red-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Urgente
                </span>
              )}
              <span className="bg-sky-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Donacion solidaria
              </span>
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                {typeLabel}
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div
            className={`p-6 sm:p-8 pb-24 ${!isFullscreen ? "max-h-[50vh] overflow-y-auto" : ""}`}
          >
            <h2 className="text-2xl font-black mb-6">{campaign.title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Descripción */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Descripcion:</h3>
                  <p className="text-black leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {/* Información Bancaria */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-sky-500/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-sky-500">
                      account_balance
                    </span>
                    <h3 className="text-xl font-bold text-black">
                      Datos Bancarios
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* CBU */}
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        CBU / CVU
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-sm text-black break-all">
                          {campaign.cbu}
                        </div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(campaign.cbu)
                          }
                          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600"
                          title="Copiar CBU"
                        >
                          <span className="material-symbols-outlined text-xl">
                            content_copy
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Alias */}
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Alias
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-sm text-black">
                          {campaign.alias}
                        </div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(campaign.alias)
                          }
                          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600"
                          title="Copiar Alias"
                        >
                          <span className="material-symbols-outlined text-xl">
                            content_copy
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Account Holder */}
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Titular de la Cuenta
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-black font-medium">
                        {campaign.accountHolder}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                {(hasWhatsapp || hasEmail) && (
                  <div className="bg-sky-500/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">
                      Información de Contacto
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Responsable:</span>
                        <span className="font-medium">
                          {campaign.responsibleName}
                        </span>
                      </div>
                      {hasWhatsapp && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold">WhatsApp:</span>
                          {waHref ? (
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-black hover:text-sky-500 transition-colors"
                            >
                              {campaign.whatsappNumber}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {campaign.whatsappNumber}
                            </span>
                          )}
                        </div>
                      )}
                      {hasEmail && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold">Email:</span>
                          {mailHref ? (
                            <a
                              href={mailHref}
                              className="font-medium text-black hover:text-sky-500 transition-colors"
                            >
                              {campaign.contactEmail}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {campaign.contactEmail}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna lateral - Acciones y Detalles */}
              <div className="space-y-6">
                {/* Resumen de Meta (Destacado) */}
                <div className="bg-gradient-to-br from-primary/10 to-accent-teal/10 rounded-2xl p-6 border border-primary/10 text-center">
                  <p className="text-sm text-gray-600 font-bold mb-1 uppercase tracking-wider">
                    Meta a recaudar
                  </p>
                  <p className="text-3xl font-black text-green-700 mb-2">
                    ${campaign.goal.toLocaleString("es-AR")}
                  </p>
                  <p className="text-xs text-black/60 font-medium">
                    Tu aporte hace la diferencia para {campaign.petName}
                  </p>
                </div>

                {/* Acciones principales */}
                <div className="space-y-3">
                  {waHref && (
                    <button
                      onClick={() => window.open(waHref, "_blank")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    >
                      <span className="material-symbols-outlined text-xl">
                        chat
                      </span>
                      Contactar por WhatsApp
                    </button>
                  )}

                  {mailHref && (
                    <a
                      href={mailHref}
                      className="w-full bg-white dark:bg-white/5 border-2 border-sky-500 hover:border-sky-600 text-sky-500 hover:text-sky-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-sky-500/5"
                    >
                      <span className="material-symbols-outlined text-xl">
                        mail
                      </span>
                      Enviar Email
                    </a>
                  )}
                </div>

                {/* Información adicional */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-sky-500/10">
                  <h4 className="font-bold mb-4 text-lg">
                    Detalles de la donación
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                      <span className="text-sm text-black/70">Mascota:</span>
                      <span className="text-sm font-bold text-black">
                        {campaign.petName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                      <span className="text-sm text-black/70">
                        Tipo de Ayuda:
                      </span>
                      <span className="text-sm font-bold text-black">
                        {typeLabel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                      <span className="text-sm text-black/70">
                        Fecha Límite:
                      </span>
                      <span className="text-sm font-bold text-urgent-red">
                        {campaign.deadline}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-black/70">
                        Responsable:
                      </span>
                      <span className="text-sm font-bold text-black">
                        {campaign.responsibleName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de imágenes */}
      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        src={campaign.image}
        alt={campaign.title}
      />
    </>
  );
};

export default DonationModal;
