import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface UsePwaInstallOptions {
  /** Fuerza la aparición del botón para testing (útil en localhost) */
  forceShow?: boolean;
}

interface UsePwaInstallReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isLoading: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
}

export function usePwaInstall(options: UsePwaInstallOptions = {}): UsePwaInstallReturn {
  const { forceShow = false } = options;
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debug: verificar si el navegador soporta el evento
    console.log("🔍 PWA: Verificando soporte para beforeinstallprompt...");

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir el comportamiento automático del navegador
      e.preventDefault();

      // Guardar el evento para usarlo después
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      console.log("📱 PWA: Evento beforeinstallprompt capturado");
    };

    const handleAppInstalled = () => {
      // Limpiar el evento guardado
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);

      console.log("✅ PWA: Aplicación instalada correctamente");
    };

    // Escuchar el evento beforeinstallprompt
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Escuchar el evento appinstalled
    window.addEventListener("appinstalled", handleAppInstalled);

    // Verificar si ya está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("📱 PWA: Ya está instalada en modo standalone");
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Actualizar isInstallable cuando cambia forceShow
  useEffect(() => {
    if (forceShow) {
      console.log("🔧 PWA: Modo forceShow activado");
      setIsInstallable(true);
    }
  }, [forceShow]);

  const install = useCallback(async () => {
    // Si no hay deferredPrompt pero forceShow está activo, intentamos de todas formas
    if (!deferredPrompt && !forceShow) {
      console.warn("⚠️ PWA: No hay evento de instalación disponible");
      return;
    }

    setIsLoading(true);

    try {
      // Si hay deferredPrompt, usarlo; si no, intentar mostrar prompt manualmente
      // (esto último probablemente falle, pero al menos intentamos)
      if (deferredPrompt) {
        // Mostrar el diálogo de instalación nativo
        await deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const userChoice = await deferredPrompt.userChoice;

        if (userChoice.outcome === "accepted") {
          console.log("✅ PWA: Usuario aceptó la instalación");
        } else {
          console.log("❌ PWA: Usuario rechazado la instalación");
          // Ocultar el botón después de rechazar
          setIsInstallable(false);
        }

        // Limpiar el evento guardado
        setDeferredPrompt(null);
      } else {
        console.warn("⚠️ PWA: No se pudo mostrar el prompt (forceShow mode)");
      }
    } catch (error) {
      console.error("❌ PWA: Error durante la instalación:", error);
    } finally {
      setIsLoading(false);
    }
  }, [deferredPrompt, forceShow]);

  const dismiss = useCallback(() => {
    setIsInstallable(false);
    console.log("ℹ️ PWA: Botón de instalación ocultado");
  }, []);

  return {
    isInstallable,
    isInstalled,
    isLoading,
    install,
    dismiss,
  };
}
