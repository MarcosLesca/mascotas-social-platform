import { usePwaInstall } from "../../hooks/usePwaInstall";
import "./PwaInstallBanner.css";

interface PwaInstallBannerProps {
  className?: string;
  /** Fuerza la aparición del banner para testing */
  forceShow?: boolean;
}

export function PwaInstallBanner({
  className = "",
  forceShow = false,
}: PwaInstallBannerProps) {
  const { isInstallable, isLoading, install, dismiss } = usePwaInstall({
    forceShow,
  });

  if (!isInstallable) {
    return null;
  }

  return (
    <div className={`pwa-install-banner ${className}`.trim()}>
      <div className="pwa-install-banner__content">
        <div className="pwa-install-banner__icon">
          <img
            src="/pwa-192x192.png"
            alt="Logo de la app"
            width={36}
            height={36}
          />
        </div>

        <div className="pwa-install-banner__text">
          <strong>¡Instalá nuestra app!</strong>
        </div>

        <div className="pwa-install-banner__actions">
          <button
            type="button"
            className="pwa-install-banner__btn pwa-install-banner__btn--install"
            onClick={install}
            disabled={isLoading}
          >
            {isLoading ? "Instalando..." : "Instalar"}
          </button>
          <button
            type="button"
            className="pwa-install-banner__btn pwa-install-banner__btn--dismiss"
            onClick={dismiss}
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
