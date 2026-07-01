import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/api';

const ReviewCard = ({ review }) => {
  const userObj = review.user || {};
  const starsArray = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-luxury-beige rounded-2xl p-5 shadow-luxury"
    >
      <div className="flex items-center justify-between mb-3.5">
        {/* User profile */}
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(userObj.profilePicture)}
            alt={userObj.name}
            className="w-10 h-10 rounded-full object-cover border border-[#E5D3B3]"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-luxury-dark">{userObj.name || 'Anonymous'}</span>
            <span className="text-[10px] text-luxury-muted">Verified Attendee</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5">
          {starsArray.map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= review.rating 
                  ? 'text-luxury-gold fill-luxury-gold' 
                  : 'text-luxury-beige'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-xs text-luxury-muted leading-relaxed font-sans font-medium">
        "{review.comment}"
      </p>

      {/* Date */}
      <div className="text-[9px] text-luxury-muted/70 text-right mt-3">
        {new Date(review.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
