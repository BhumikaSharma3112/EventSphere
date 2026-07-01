import React from 'react';
import { Sparkles } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-luxury-cream/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer luxurious spinning ring */}
        <div className="w-16 h-16 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
        
        {/* Inner static luxury icon */}
        <div className="absolute">
          <Sparkles className="h-6 w-6 text-luxury-gold animate-pulse" />
        </div>
      </div>
      <span className="font-display text-sm tracking-[0.2em] font-medium text-luxury-dark mt-4 animate-pulse">
        L O A D I N G
      </span>
    </div>
  );
};

export default Loader;
