import React, { useState, useRef, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    image: string;
    name: string;
    location?: string;
    description?: string;
    title?: string;
  };
  type: 'pet' | 'donation';
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, item, type }) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDonation = type === 'donation';
  const title = isDonation ? item.title || '' : item.name;
  const subtitle = isDonation 
    ? item.description?.slice(0, 50) + '...' 
    : item.location || '';
  
  const basePath = isDonation ? '/donations' : (type === 'pet' ? '/lost-pets' : '/adoption');
  const itemUrl = `${window.location.origin}${basePath}?pet=${item.id}`;

  const shareData = {
    title: `${isDonation ? 'Campaña de Donación' : 'Mascota'}: ${title}`,
    text: `${isDonation ? 'Ayudanos a llegar a esta campaña' : 'Conocén a'} ${title}${subtitle ? ` - ${subtitle}` : ''}. ¡Ayudanos a compartir!`,
    url: itemUrl
  };

  const handleShare = async (platform: string) => {
    // Native share
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    switch (platform) {
      case 'native':
      case 'copy_link':
        try {
          await navigator.clipboard.writeText(itemUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Error al copiar:', err);
        }
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`);
        break;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[320px] max-w-[90vw] bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header con imagen */}
        <div className="relative h-32">
          <img 
            src={item.image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white font-bold text-sm truncate">{title}</p>
            {subtitle && (
              <p className="text-white/80 text-xs truncate">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Opciones */}
        <div className="p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
            Compartir en
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {navigator.share && (
              <button
                type="button"
                onClick={() => {
                  handleShare('native');
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">share</span>
                </div>
                <span className="text-xs font-medium">Más opciones</span>
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                handleShare('whatsapp');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                handleShare('sms');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">chat</span>
              </div>
              <span className="text-xs font-medium">SMS</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                handleShare('email');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">mail</span>
              </div>
              <span className="text-xs font-medium">Email</span>
            </button>
          </div>
          
          {/* Copiar link */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => handleShare('copy_link')}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-sm">link</span>
                </div>
                <span className="text-sm font-medium">
                  {copied ? '¡Copiado!' : 'Copiar enlace'}
                </span>
              </div>
              {copied && (
                <span className="text-green-600 text-sm">✓</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
