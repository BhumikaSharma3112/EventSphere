import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../redux/slices/eventSlice';
import MainLayout from '../layouts/MainLayout';
import Loader from '../Components/Loader';
import ReviewCard from '../Components/ReviewCard';
import Modal from '../Components/Modal';
import Toast from '../Components/Toast';
import API, { getImageUrl } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Calendar, MapPin, Sparkles, User, Ticket, Award, 
  ChevronRight, Star, Heart, CheckCircle2, AlertCircle
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentEvent, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [ticketCount, setTicketCount] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(id));
    loadReviews();
  }, [dispatch, id]);

  const loadReviews = async () => {
    try {
      const res = await API.get(`/reviews/event/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const handleBookTickets = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await API.post('/tickets/book', { eventId: id, ticketCount });
      setBookingLoading(false);
      setIsBookingOpen(false);
      setToastType('success');
      setToastMessage(`Congratulations! ${ticketCount} pass(es) booked successfully.`);
      
      // Fire luxurious gold confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF0F1', '#FAF6EE']
      });

      // Reload event to update sold ticket counts
      dispatch(fetchEventById(id));
    } catch (err) {
      setBookingLoading(false);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setReviewLoading(true);
    try {
      await API.post('/reviews', { eventId: id, rating, comment });
      setReviewLoading(false);
      setComment('');
      setRating(5);
      setToastType('success');
      setToastMessage('Review submitted successfully.');
      loadReviews();
    } catch (err) {
      setReviewLoading(true);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Review submission failed');
      setTimeout(() => setReviewLoading(false), 2000);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-red-500 font-medium text-xs">{error}</div>
      </MainLayout>
    );
  }
  if (!currentEvent) return null;

  const dateStr = new Date(currentEvent.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const availableCapacity = currentEvent.capacity - currentEvent.ticketsSold;

  return (
    <MainLayout>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10px] text-luxury-muted font-medium tracking-wider uppercase mb-8">
        <Link to="/" className="hover:text-luxury-gold">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/events" className="hover:text-luxury-gold">Events</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-luxury-dark truncate">{currentEvent.title}</span>
      </div>

      {/* Core details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        
        {/* Main Event Media & Info Segment */}
        <div className="lg:col-span-2 flex flex-col gap-8 text-left">
          {/* Banner */}
          <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/25 bg-luxury-beige">
            <img
              src={getImageUrl(currentEvent.bannerImage)}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-luxury-gold mb-3.5 block">
              {currentEvent.category}
            </span>
            <h1 className="font-display font-semibold text-2xl md:text-3xl text-luxury-dark mb-4 leading-tight">
              {currentEvent.title}
            </h1>
            <p className="text-xs leading-relaxed text-luxury-muted mb-8 font-sans font-medium">
              {currentEvent.description}
            </p>
          </div>

          {/* Gallery Images (if present) */}
          {currentEvent.galleryImages && currentEvent.galleryImages.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-base text-luxury-dark mb-4">Visual Previews</h3>
              <div className="grid grid-cols-3 gap-4">
                {currentEvent.galleryImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-luxury-beige border border-[#E5D3B3]/20 shadow-sm">
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews list */}
          <div className="border-t border-luxury-beige pt-8 mt-4">
            <h3 className="font-display font-semibold text-base text-luxury-dark mb-6">Guest Reviews</h3>
            
            <div className="flex flex-col gap-4.5 mb-8">
              {reviews.length === 0 ? (
                <p className="text-xs text-luxury-muted italic">No reviews submitted yet for this invitation pass.</p>
              ) : (
                reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))
              )}
            </div>

            {/* Write a review (Only if registered) */}
            {isAuthenticated && (
              <form onSubmit={handleAddReview} className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury">
                <h4 className="font-display font-semibold text-sm text-luxury-dark mb-4">Submit Verified Review</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-luxury-muted font-medium">Rating:</span>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3 py-1.5 text-xs text-luxury-dark focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience at the event..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  className="w-full bg-luxury-cream border border-[#E5D3B3]/40 rounded-2xl p-4 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold placeholder-luxury-muted/70 mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-6 py-2.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Sidebar Reservation pass drawer card */}
        <div className="flex flex-col gap-6 text-left">
          <div className="glass-panel border border-[#E5D3B3]/45 rounded-[32px] p-6 shadow-luxury-lg sticky top-28">
            
            {/* Header info */}
            <div className="border-b border-luxury-beige pb-4.5 mb-5.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Admission</span>
                <span className="font-display font-bold text-xl text-luxury-dark">
                  {currentEvent.price > 0 ? `₹${currentEvent.price}` : 'Complimentary'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Remaining</span>
                <span className="font-sans text-xs font-semibold text-luxury-gold">
                  {availableCapacity > 0 ? `${availableCapacity} Passes` : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Event features */}
            <div className="flex flex-col gap-4 text-xs text-luxury-muted font-medium mb-6">
              <div className="flex gap-3">
                <Calendar className="h-4.5 w-4.5 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-luxury-dark text-[13px]">{dateStr}</div>
                  <div className="text-[11px] text-luxury-muted mt-0.5">Starts at {currentEvent.time}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-4.5 w-4.5 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-luxury-dark text-[13px]">{currentEvent.location}</div>
                  <div className="text-[11px] text-luxury-muted mt-0.5">{currentEvent.city}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <User className="h-4.5 w-4.5 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-luxury-dark text-[13px]">Curated By</div>
                  <Link to={`/organizer/${currentEvent.organizer?._id}`} className="text-[11px] text-luxury-gold font-semibold hover:underline mt-0.5">
                    {currentEvent.organizer?.name || 'Event Host'}
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA action */}
            {availableCapacity > 0 ? (
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4.5 rounded-2xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer"
              >
                Request Access Pass
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4.5 rounded-2xl bg-luxury-beige text-luxury-muted text-xs font-semibold tracking-widest uppercase transition-all cursor-not-allowed"
              >
                Passes Fully Reserved
              </button>
            )}

          </div>
        </div>

      </div>

      {/* Booking Modal Confirmation */}
      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title="Confirm Invitation Booking">
        <div className="flex flex-col gap-4 text-left">
          <p className="text-xs text-luxury-muted leading-relaxed">
            Please select the count of passes you require. Confirmed tickets will be saved directly in your dashboard.
          </p>

          <div className="flex items-center justify-between bg-luxury-cream border border-luxury-beige rounded-2xl p-4 my-2">
            <span className="text-xs font-semibold text-luxury-dark">Pass Count</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="w-8 h-8 rounded-full border border-[#E5D3B3] flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-white transition-all"
              >
                -
              </button>
              <span className="font-display font-bold text-sm">{ticketCount}</span>
              <button
                onClick={() => setTicketCount(Math.min(availableCapacity, ticketCount + 1))}
                className="w-8 h-8 rounded-full border border-[#E5D3B3] flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-white transition-all"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-luxury-beige pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-luxury-muted">Total Due</span>
              <span className="font-display font-bold text-lg text-luxury-dark">
                {currentEvent.price > 0 ? `₹${currentEvent.price * ticketCount}` : 'Complimentary'}
              </span>
            </div>
            
            <button
              onClick={handleBookTickets}
              disabled={bookingLoading}
              className="px-6 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {bookingLoading ? 'Reserving...' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </Modal>

    </MainLayout>
  );
};

export default EventDetails;
