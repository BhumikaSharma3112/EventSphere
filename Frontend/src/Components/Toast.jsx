import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import gsap from 'gsap';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (!message || !toastRef.current) return;

    // Slide in animation
    gsap.fromTo(
      toastRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  const handleClose = () => {
    if (!toastRef.current) {
      if (onClose) onClose();
      return;
    }
    gsap.to(toastRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      onComplete: onClose
    });
  };

  if (!message) return null;

  return (
    <div ref={toastRef} className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-white border border-[#E5D3B3]/40 rounded-2xl shadow-luxury-lg px-4.5 py-3.5 max-w-sm">
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
      )}
      
      <div className="text-xs font-medium text-luxury-dark pr-4">{message}</div>
      
      <button 
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-luxury-beige text-luxury-muted hover:text-luxury-dark transition-all cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default Toast;
