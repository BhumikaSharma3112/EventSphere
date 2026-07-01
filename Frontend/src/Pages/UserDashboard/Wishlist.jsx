import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import EventCard from '../../Components/EventCard';
import API from '../../services/api';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const [wishlistEvents, setWishlistEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Query user info and wishlist populate details
        const res = await API.get('/auth/me');
        const wishlistIds = res.data.user?.wishlist || [];
        
        // Load all events and filter matches or fetch
        const eventRes = await API.get('/events?limit=100');
        const allEvents = eventRes.data.events || [];
        const matches = allEvents.filter(e => wishlistIds.includes(e._id));
        setWishlistEvents(matches);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleWishlistToggle = async (eventId) => {
    // Optimistic remove
    setWishlistEvents(wishlistEvents.filter(e => e._id !== eventId));
  };

  return (
    <DashboardLayout>
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">My Wishlist</h1>
        <p className="text-xs text-luxury-muted">
          Your private curations saved for future pass reservations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-xs text-luxury-muted italic">Loading wishlist...</div>
      ) : wishlistEvents.length === 0 ? (
        <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8 flex flex-col items-center">
          <Heart className="h-8 w-8 text-luxury-muted mb-2.5" />
          <p className="text-xs text-luxury-muted mb-2">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlistEvents.map((evt) => (
            <EventCard 
              key={evt._id} 
              event={evt} 
              isWishlisted={true}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Wishlist;
