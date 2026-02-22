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
  title = 'Debes iniciar sesión para publicar.',
  message = 'Accedé o creá una cuenta para continuar.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#203553] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#ecdbbd]/30">
        <div className="text-center">
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
              className="flex-1 px-4 py-3 bg-[#ecdbbd] text-[#203553] rounded-lg font-bold text-center hover:bg-[#203553] hover:text-[#ecdbbd] hover:border-2 hover:border-[#ecdbbd] transition-colors"
              onClick={onClose}
            >
              Iniciar sesión
            </a>
            <a
              href="/signup"
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#ecdbbd] text-[#ecdbbd] rounded-lg font-bold text-center hover:bg-[#ecdbbd] hover:text-[#203553] transition-colors"
              onClick={onClose}
            >
              Registrarse
            </a>
          </div>

          {/* Cancelar */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-sm text-[#ecdbbd]/60 hover:text-[#ecdbbd] hover:cursor-pointer transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
