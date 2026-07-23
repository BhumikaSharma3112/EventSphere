import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Compass } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E5D3B3]/40 mt-20 pt-16 pb-8 px-6 text-luxury-dark relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Branding */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="EventSphere Logo" className="h-8 w-8 rounded-full border border-luxury-gold/20 object-cover" />
            <span className="font-display text-xl tracking-[0.15em] font-semibold">EVENTSPHERE</span>
          </div>
          <p className="text-xs leading-relaxed text-luxury-muted">
            Curating and presenting the world's most exquisite arts, haute couture, spa retreats, and grand galas. Welcome to pure event luxury.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="p-2 rounded-full bg-luxury-beige/40 hover:bg-luxury-blush text-luxury-muted hover:text-luxury-gold transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-luxury-beige/40 hover:bg-luxury-blush text-luxury-muted hover:text-luxury-gold transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-luxury-beige/40 hover:bg-luxury-blush text-luxury-muted hover:text-luxury-gold transition-all duration-300">
              <Compass className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Discovery Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-luxury-gold">Discover</h3>
          <ul className="flex flex-col gap-2.5 text-xs font-medium text-luxury-muted">
            <li><Link to="/events" className="hover:text-luxury-gold transition-all">All Events</Link></li>
            <li><Link to="/events?category=galas" className="hover:text-luxury-gold transition-all">Galas & Soirées</Link></li>
            <li><Link to="/events?category=art" className="hover:text-luxury-gold transition-all">Arts & Exhibitions</Link></li>
            <li><Link to="/events?category=wellness" className="hover:text-luxury-gold transition-all">Wellness & Spa</Link></li>
          </ul>
        </div>

        {/* Platform Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-luxury-gold">Platform</h3>
          <ul className="flex flex-col gap-2.5 text-xs font-medium text-luxury-muted">
            <li><Link to="/about" className="hover:text-luxury-gold transition-all">Our Curations</Link></li>
            <li><Link to="/contact" className="hover:text-luxury-gold transition-all">Inquiries</Link></li>
            <li><Link to="/login" className="hover:text-luxury-gold transition-all">Organizer Center</Link></li>
            <li><Link to="/signup" className="hover:text-luxury-gold transition-all">Register Guest</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-luxury-gold">The Bulletin</h3>
          <p className="text-xs text-luxury-muted leading-relaxed">
            Subscribe to receive private invitations and schedules for upcoming exclusive experiences.
          </p>
          <div className="flex items-center rounded-full border border-[#E5D3B3]/40 bg-luxury-cream p-1">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent border-none text-xs px-3 focus:outline-none placeholder-luxury-muted/70 text-luxury-dark"
            />
            <button className="p-2 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white cursor-pointer transition-all">
              <Mail className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-luxury-beige flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-luxury-muted tracking-widest uppercase">
          © {currentYear} EVENTSPHERE. ALL RIGHTS RESERVED.
        </span>
        <div className="flex items-center gap-6 text-[10px] text-luxury-muted tracking-widest uppercase">
          <a href="#" className="hover:text-luxury-gold transition-all">Privacy Policy</a>
          <a href="#" className="hover:text-luxury-gold transition-all">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;