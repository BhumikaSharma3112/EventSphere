import React from 'react';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const OrganizerCard = ({ organizer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-6 shadow-luxury flex flex-col items-center text-center group"
    >
      {/* Profile Pic with Gold Border Ring */}
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-luxury-gold p-0.5 transition-transform duration-500 group-hover:rotate-6">
          <img
            src={getImageUrl(organizer.profilePicture)}
            alt={organizer.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {organizer.isVerifiedOrganizer && (
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-luxury-beige">
            <CheckCircle className="h-4.5 w-4.5 text-luxury-gold fill-luxury-gold/10" />
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-display font-semibold text-base text-luxury-dark group-hover:text-luxury-gold transition-colors mb-1">
        {organizer.name}
      </h3>

      {/* Business Name */}
      <p className="text-[10px] tracking-wider uppercase font-semibold text-luxury-gold mb-2.5">
        {organizer.verificationDocuments?.businessName || 'Elite Host'}
      </p>

      {/* Bio */}
      <p className="text-xs text-luxury-muted leading-relaxed line-clamp-2 mb-4">
        {organizer.bio || 'Curator of high-end social gatherings, modern galleries, and premium client experiences.'}
      </p>

      {/* Action Button */}
      <RouterLink
        to={`/organizer/${organizer._id}`}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-luxury-beige/30 hover:bg-luxury-gold hover:text-white transition-all text-xs font-semibold text-luxury-dark border border-[#E5D3B3]/35"
      >
        View Profile
        <ArrowRight className="h-3.5 w-3.5" />
      </RouterLink>
    </motion.div>
  );
};

export default OrganizerCard;
