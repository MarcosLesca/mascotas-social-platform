import { usePwaInstall } from "../../hooks/usePwaInstall";
import "./PwaInstallButton.css";

interface PwaInstallButtonProps {
  className?: string;
  label?: string;
  loadingLabel?: string;
  installedLabel?: string;
  showAfterInstall?: boolean;
}

export function PwaInstallButton({
  className = "",
  label = "Instalar App",
  loadingLabel = "Instalando...",
  installedLabel = "✓ Instalada",
  showAfterInstall = false,
}: PwaInstallButtonProps) {
  const { isInstallable, isInstalled, isLoading, install } = usePwaInstall();

  // No mostrar si no es instalable Y (no mostrar después de instalar O ya está instalada)
  const shouldShow =
    isInstallable || (showAfterInstall && isInstalled);

  if (!shouldShow) {
    return null;
  }

  return (
    <button
      className={`pwa-install-button ${className}`.trim()}
      onClick={install}
      disabled={isLoading}
      aria-label={label}
      type="button"
    >
      {isInstalled && !isLoading ? (
        <span className="pwa-install-button__text">{installedLabel}</span>
      ) : isLoading ? (
        <span className="pwa-install-button__text">{loadingLabel}</span>
      ) : (
        <>
          <span className="pwa-install-button__icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </span>
          <span className="pwa-install-button__text">{label}</span>
        </>
      )}
    </button>
  );
}
