import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=400',
      title: 'Rose Gold Gala',
      size: 'md:col-span-2 md:row-span-2'
    },
    {
      url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=400',
      title: 'Art Exhibition',
      size: 'md:col-span-1 md:row-span-1'
    },
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400',
      title: 'Haute Couture Runway',
      size: 'md:col-span-1 md:row-span-2'
    },
    {
      url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
      title: 'Malibu Retreat',
      size: 'md:col-span-2 md:row-span-1'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto auto-rows-[200px] px-4">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className={`relative rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/25 group ${img.size}`}
        >
          {/* Zoom Image */}
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Luxury Hover Overlay */}
          <div className="absolute inset-0 bg-luxury-dark/45 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <span className="font-display font-semibold text-lg tracking-wider text-white border-b-2 border-luxury-light-gold/60 pb-1">
              {img.title}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
