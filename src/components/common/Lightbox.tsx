import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  caption?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  caption,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div 
        className="w-full max-w-6xl flex items-center justify-between py-2 text-stone-300"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
          Photo {currentIndex + 1} of {images.length} {caption && `• ${caption}`}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Enlarged view ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-200"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-emerald-900 text-white border border-stone-700/60 shadow-xl transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-emerald-900 text-white border border-stone-700/60 shadow-xl transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div 
        className="w-full max-w-3xl py-2 flex items-center justify-center gap-2 overflow-x-auto"
        onClick={e => e.stopPropagation()}
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`w-16 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
              idx === currentIndex ? 'border-emerald-500 scale-105 shadow-md' : 'border-stone-800 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
