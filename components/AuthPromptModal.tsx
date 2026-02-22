import React from 'react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  title = '¡Ups! Necesitás estar conectado',
  message = 'Para publicar en Mascotas SJ tenés que crear una cuenta o iniciar sesión. Es gratis y rápido.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#203553] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#ecdbbd]/30">
        <div className="text-center">
          {/* Icono */}
          <div className="w-16 h-16 mx-auto mb-4 bg-[#ecdbbd]/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#ecdbbd]">
              paw_pointed
            </span>
          </div>

          {/* Título */}
          <h2 className="text-xl sm:text-2xl font-black mb-3 text-[#ecdbbd]">
            {title}
          </h2>

          {/* Mensaje */}
          <p className="text-sm sm:text-base text-[#ecdbbd]/80 mb-6">
            {message}
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/login"
              className="flex-1 px-4 py-3 bg-[#ecdbbd] text-[#203553] rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              Iniciar sesión
            </a>
            <a
              href="/register"
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#ecdbbd]/50 text-[#ecdbbd] rounded-xl font-bold text-center hover:bg-[#ecdbbd]/10 transition-colors"
              onClick={onClose}
            >
              Registrarse
            </a>
          </div>

          {/* Cancelar */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-sm text-[#ecdbbd]/60 hover:text-[#ecdbbd] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
