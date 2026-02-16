import React, { useState, useEffect } from 'react';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, onClose, src, alt }) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
    // Reset position if zooming out sets scale back to 1
    if (Math.max(scale - 0.5, 1) === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-[110] flex gap-2">
        <button
          onClick={handleZoomOut}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale <= 1}
          title="Zoom Out"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button
          onClick={handleZoomIn}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale >= 4}
          title="Zoom In"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-red-500/50 rounded-full text-white backdrop-blur-sm transition-all ml-2"
          title="Cerrar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            maxHeight: '100vh',
            maxWidth: '100vw'
          }}
          className="object-contain select-none w-auto h-auto max-w-full max-h-full"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Helper Hint */}
        {scale === 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none fade-out-hint">
            Usa los controles para hacer zoom
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
