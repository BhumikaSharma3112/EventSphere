import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Animate modal entry
      gsap.fromTo(
        '.modal-backdrop',
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        '.modal-content',
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-luxury-dark/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white w-full max-w-lg rounded-3xl shadow-luxury-lg overflow-hidden border border-[#E5D3B3]/40">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-beige">
          <h3 className="font-display font-semibold text-lg text-luxury-dark">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-luxury-beige text-luxury-muted hover:text-luxury-dark transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
