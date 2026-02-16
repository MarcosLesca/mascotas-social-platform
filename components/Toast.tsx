import React, { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  showAcceptButton?: boolean;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastNotification: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-500';
      case 'error':
        return 'bg-red-50 border-red-500';
      case 'warning':
        return 'bg-orange-50 border-orange-500';
      case 'info':
        return 'bg-blue-50 border-blue-500';
      default:
        return 'bg-gray-50 border-gray-500';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-orange-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  // Si es success y showAcceptButton es true, mostrar como modal centrado
  if (toast.type === 'success' && toast.showAcceptButton) {
    return (
      <>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 300ms' }}
        />
        
        {/* Modal centrado */}
        <div 
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-2xl shadow-2xl border-2 ${getColors()} transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transition: 'all 300ms' }}
        >
          <div className="text-center">
            <div className={`text-4xl mb-4 ${getIconColor()}`}>
              {getIcon()}
            </div>
            <p className="text-gray-800 text-lg font-medium mb-6">
              {toast.message}
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </>
    );
  }

  // Toast normal para otros tipos
  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border-2
        flex items-center gap-3 backdrop-blur-sm transition-all duration-300
        ${getColors()} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      style={{ transition: 'all 300ms' }}
    >
      <span className={`text-xl ${getIconColor()}`}>
        {getIcon()}
      </span>
      <p className="font-medium text-sm leading-tight flex-1 text-gray-800">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="px-2 py-1 rounded-full hover:bg-gray-200 transition-colors text-xs font-bold text-gray-600"
      >
        ✕
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <>
      {/* Toasts normales */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {toasts
          .filter(t => !(t.type === 'success' && t.showAcceptButton))
          .map(toast => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
            />
          ))}
      </div>
      
      {/* Modal de éxito con botón aceptar (solo uno a la vez) */}
      {toasts
        .filter(t => t.type === 'success' && t.showAcceptButton)
        .slice(0, 1)
        .map(toast => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
    </>
  );
};

export type { Toast };
export { ToastContainer };
export default ToastContainer;
