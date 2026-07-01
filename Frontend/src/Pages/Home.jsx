import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchCategories } from '../redux/slices/eventSlice';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../Components/SearchBar';
import CategoryCard from '../Components/CategoryCard';
import EventCard from '../Components/EventCard';
import Timeline from '../Components/Timeline';
import Gallery from '../Components/Gallery';
import StatisticsCounter from '../Components/StatisticsCounter';
import { Sparkles, Calendar, ArrowRight, Award, Quote, ChevronDown, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, categories, loading } = useSelector((state) => state.events);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents({ limit: 6 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = ({ search, category, city }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (city) params.append('city', city);
    navigate(`/events?${params.toString()}`);
  };

  const featuredEvent = events.find(e => e.isFeatured) || events[0];
  const trendingEvents = events.filter(e => e.isTrending).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const testimonials = [
    {
      quote: "EventSphere completely reimagined how we attend exclusive events. The luxury pass PDF with inline check-in is extremely convenient.",
      author: "Charlotte Du Pont",
      role: "Art Collector & Critic"
    },
    {
      quote: "As an organizer, the real-time ticket analytics and scanner check-in allow us to provide absolute white-glove treatment.",
      author: "Vance Sterling",
      role: "CEO, Sterling Soirées"
    }
  ];

  const faqs = [
    {
      q: "How do I receive my admission pass?",
      a: "Upon completing your ticket registration, a premium PDF pass featuring a unique QR code is generated instantly in your dashboard. You will also receive an invitation email containing the ticket details."
    },
    {
      q: "Is there a guest dress code policy?",
      a: "Yes, because EventSphere curates high-end luxury events, most hosts request formal black-tie or smart elegant dress code details. Specific parameters are listed on the event detail pages."
    },
    {
      q: "How does organizer verification work?",
      a: "To curate on EventSphere, organizers submit business licensing and credential logs. Our administration moderates and approves profiles to ensure that only legitimate high-quality experiences are listed."
    }
  ];

  return (
    <MainLayout>
      {/* 1. Large Luxury Hero Banner */}
      <section className="relative pt-16 pb-20 md:py-32 flex flex-col items-center justify-center text-center">
        
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-luxury-beige/65 border border-[#E5D3B3]/40 text-[10px] tracking-[0.25em] uppercase font-semibold text-luxury-gold mb-6"
        >
          <Sparkles className="h-3 w-3" />
          The Art of Gathering
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold tracking-tight text-luxury-dark max-w-4xl leading-[1.1] mb-6"
        >
          Curating the World's Most <br className="hidden md:inline" />
          <span className="italic font-normal text-luxury-gold">Exclusive</span> Gatherings
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base leading-relaxed text-luxury-muted max-w-2xl mb-10 font-sans"
        >
          Experience intimate string quartets, high fashion trunk shows, boutique wellness retreats, and grand champagne soirée banquets. Designed for the connoisseur.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link
            to="/events"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-sm"
          >
            Explore Curations
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-luxury-gold text-luxury-dark hover:bg-luxury-blush/30 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
          >
            Our Philosophy
          </Link>
        </motion.div>

        {/* 2. Interactive Search Bar */}
        <div className="w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-16 border-t border-luxury-beige">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/20 relative">
              <img
                src={getImageUrl(featuredEvent.bannerImage)}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-xl border border-[#E5D3B3]/25 text-[10px] uppercase tracking-widest font-semibold text-luxury-gold">
                Featured Invitation
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold mb-3">
                {featuredEvent.category}
              </span>
              <h2 className="font-display font-semibold text-2xl md:text-3xl text-luxury-dark mb-4">
                {featuredEvent.title}
              </h2>
              <p className="text-xs text-luxury-muted leading-relaxed mb-6">
                {featuredEvent.description}
              </p>
              <div className="flex items-center gap-6 mb-8 text-xs text-luxury-muted font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-luxury-gold" />
                  <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase text-luxury-muted">Admission:</span>
                  <span className="font-semibold text-luxury-dark">${featuredEvent.price}</span>
                </div>
              </div>
              <Link
                to={`/events/${featuredEvent._id}`}
                className="px-6 py-3.5 rounded-full bg-luxury-dark hover:bg-luxury-gold text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2"
              >
                Request Admission Pass
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. Categories Grid */}
      <section className="py-20 border-t border-luxury-beige">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-luxury-dark mb-3">
            Browse by Signature Style
          </h2>
          <p className="text-xs text-luxury-muted max-w-md mx-auto">
            Select a custom category to view highly focused layouts tailored to your tastes.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 max-w-5xl mx-auto px-4">
          {categories.slice(0, 5).map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Upcoming & Trending Events */}
      <section className="py-20 border-t border-luxury-beige">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div className="text-left">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-luxury-dark mb-3">
              Upcoming Premieres
            </h2>
            <p className="text-xs text-luxury-muted">
              Discover verified invitations releasing soon.
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold tracking-widest uppercase text-luxury-gold hover:text-luxury-gold-dark flex items-center gap-1.5 mt-4 sm:mt-0 transition-colors"
          >
            All Invitations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {upcomingEvents.map((evt) => (
            <EventCard key={evt._id} event={evt} />
          ))}
        </div>
      </section>

      {/* 5. Event Timeline Section */}
      <section className="py-20 border-t border-luxury-beige bg-white/35 backdrop-blur-xs rounded-[40px] px-6 my-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-luxury-dark mb-3">
            The Seasonal Timeline
          </h2>
          <p className="text-xs text-luxury-muted max-w-md mx-auto">
            Keep track of upcoming grand openings and recitals structured sequentially by date.
          </p>
        </div>

        {events.length > 0 ? (
          <Timeline events={events} />
        ) : (
          <div className="text-center text-xs text-luxury-muted py-10">
            No events scheduled.
          </div>
        )}
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 border-t border-luxury-beige">
        <div className="max-w-3xl mx-auto text-center px-4">
          <Quote className="h-10 w-10 text-luxury-light-gold mx-auto mb-6 opacity-60" />
          
          <div className="flex flex-col gap-10">
            {testimonials.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <p className="font-display text-lg md:text-xl italic text-luxury-dark leading-relaxed mb-4 max-w-xl">
                  "{t.quote}"
                </p>
                <span className="text-xs font-semibold text-luxury-gold uppercase tracking-widest">{t.author}</span>
                <span className="text-[10px] text-luxury-muted mt-0.5">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Gallery Section */}
      <section className="py-20 border-t border-luxury-beige">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-luxury-dark mb-3">
            Moments of Splendor
          </h2>
          <p className="text-xs text-luxury-muted">
            A pictorial glimpse into past EventSphere curations.
          </p>
        </div>

        <Gallery />
      </section>

      {/* 8. Statistics Counter */}
      <section className="py-12">
        <StatisticsCounter />
      </section>

      {/* 9. FAQs Section */}
      <section className="py-20 border-t border-luxury-beige max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-luxury-dark mb-3">
            Frequently Inquired
          </h2>
          <p className="text-xs text-luxury-muted">
            Important details on invitations, passes, and dress code codes.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#E5D3B3]/40 bg-white rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs font-semibold text-luxury-dark cursor-pointer hover:bg-luxury-blush/10"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-luxury-gold transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-luxury-muted border-t border-luxury-beige/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;