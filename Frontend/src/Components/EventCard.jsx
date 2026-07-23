import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/api';

const EventCard = ({ event, onWishlistToggle, isWishlisted }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const formattedYear = dateObj.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/20 flex flex-col h-full group"
    >
      {/* Banner Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-luxury-beige">
        <img
          src={getImageUrl(event.bannerImage)}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* Date Ribbon */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl flex flex-col items-center justify-center border border-[#E5D3B3]/25 shadow-glass">
          <span className="font-display font-bold text-sm tracking-tight text-luxury-dark">{formattedDate}</span>
          <span className="font-sans text-[9px] tracking-widest text-luxury-gold font-semibold uppercase">{formattedYear}</span>
        </div>

        {/* Wishlist Button */}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistToggle(event._id);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5D3B3]/20 text-luxury-dark hover:text-red-500 transition-colors shadow-glass cursor-pointer"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-luxury-dark/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] tracking-widest uppercase font-semibold">
          <Sparkles className="h-2.5 w-2.5 text-luxury-light-gold" />
          {event.category}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Title */}
        <Link to={`/events/${event._id}`}>
          <h3 className="font-display font-semibold text-lg text-luxury-dark hover:text-luxury-gold transition-colors duration-300 line-clamp-1 mb-2">
            {event.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed mb-4">
          {event.shortDescription || event.description}
        </p>

        {/* Venue/Location & Time */}
        <div className="flex flex-col gap-2 mt-auto mb-5 text-[11px] font-medium text-luxury-muted">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
            <span>{event.time}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-luxury-beige pt-4 flex items-center justify-between mt-auto">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-luxury-muted">Admission</span>
            <span className="font-display font-bold text-base text-luxury-dark">
              {event.price > 0 ? `₹${event.price}` : 'Complimentary'}
            </span>
          </div>

          {/* Book Pass Link */}
          <Link
            to={`/events/${event._id}`}
            className="text-xs tracking-widest uppercase font-semibold text-luxury-dark border-b-2 border-luxury-gold/30 hover:border-luxury-gold hover:text-luxury-gold transition-all pb-0.5"
          >
            Reserve Pass
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default EventCard;
