import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ReviewCard from '../../Components/ReviewCard';
import API from '../../services/api';
import { Star } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch all events then reviews for each event, or fetch via mock
        const eventRes = await API.get('/events?limit=100');
        const myEvents = eventRes.data.events || [];
        
        let allReviews = [];
        for (const evt of myEvents) {
          const revRes = await API.get(`/reviews/event/${evt._id}`);
          if (revRes.data.reviews) {
            // Append event details onto review
            const revs = revRes.data.reviews.map(r => ({ ...r, eventTitle: evt.title }));
            allReviews = [...allReviews, ...revs];
          }
        }
        
        setReviews(allReviews);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <DashboardLayout>
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Guest Feedbacks</h1>
        <p className="text-xs text-luxury-muted">
          Review comments and ratings submitted by guests who reserved passes for your curations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-xs text-luxury-muted italic">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8">
          <p className="text-xs text-luxury-muted">No guest reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {reviews.map((rev) => (
            <div key={rev._id} className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold ml-1">
                Event: {rev.eventTitle}
              </span>
              <ReviewCard review={rev} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reviews;
