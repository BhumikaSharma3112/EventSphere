import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 text-left">
        {/* Header */}
        <section className="text-center py-10 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-luxury-beige/65 border border-[#E5D3B3]/40 text-[9px] tracking-[0.25em] uppercase font-semibold text-luxury-gold mb-6 mx-auto w-fit"
          >
            <Sparkles className="h-3 w-3" />
            Our Philosophy
          </motion.div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-luxury-dark mb-4">
            Curating Elite Lifestyle Experiences
          </h1>
          <p className="text-xs text-luxury-muted max-w-md mx-auto leading-relaxed">
            Welcome to EventSphere, a premium gathering platform merging high-end aesthetics with seamless ticket utility.
          </p>
        </section>

        {/* Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-[#E5D3B3]/25 bg-luxury-beige">
            <img
              src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600"
              alt="Luxury banquet"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-luxury-dark mb-4">A Taste of Sophistication</h2>
            <p className="text-xs leading-relaxed text-luxury-muted mb-4 font-sans font-medium">
              EventSphere was founded on the idea that event attendance should be more than just scanning a ticket—it should be an introduction to a luxurious lifestyle experience.
            </p>
            <p className="text-xs leading-relaxed text-luxury-muted font-sans font-medium">
              We vet and verify every single curation partner on our system, ensuring black-tie dinner parties, fine arts exhibitions, high runway reviews, and boutique wellness sessions are handled with absolute premium care.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-6 shadow-luxury">
            <div className="p-3 bg-luxury-blush rounded-2xl w-fit text-luxury-gold mb-4">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-luxury-dark mb-2">Curated Venues</h3>
            <p className="text-xs leading-relaxed text-luxury-muted font-sans">
              We exclusively select events hosted in elite amphitheaters, grand hotel ballrooms, and tranquil hill sanctuaries.
            </p>
          </div>

          <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-6 shadow-luxury">
            <div className="p-3 bg-luxury-blush rounded-2xl w-fit text-luxury-gold mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-luxury-dark mb-2">Vetted Organizers</h3>
            <p className="text-xs leading-relaxed text-luxury-muted font-sans">
              Hosts undergo business verification so our attendees feel completely safe and secure reserving expensive passes.
            </p>
          </div>

          <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-6 shadow-luxury">
            <div className="p-3 bg-luxury-blush rounded-2xl w-fit text-luxury-gold mb-4">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-luxury-dark mb-2">Luxury Passes</h3>
            <p className="text-xs leading-relaxed text-luxury-muted font-sans">
              Get premium PDF passes featuring unique QR codes, with email integration and smooth entry scanning.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
