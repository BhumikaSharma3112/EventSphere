import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
  // Dynamically resolve icon from string
  const LucideIcon = Icons[category.icon] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="relative aspect-square rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/25 group bg-luxury-beige cursor-pointer"
    >
      <Link to={`/events?category=${encodeURIComponent(category.name)}`}>
        {/* Background Image with Zoom */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/95 via-luxury-dark/40 to-transparent" />

        {/* Content Centered at Bottom */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl w-fit mb-3 transition-colors duration-300 group-hover:bg-luxury-gold group-hover:border-luxury-gold">
            <LucideIcon className="h-4.5 w-4.5 text-luxury-light-gold group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-display font-semibold text-lg tracking-wide mb-1 group-hover:text-luxury-light-gold transition-colors">
            {category.name}
          </h3>
          <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed font-sans">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
