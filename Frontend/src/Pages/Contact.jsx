import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Toast from '../Components/Toast';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMsg('Thank you. Our luxury concierge desk will respond to your inquiry shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <MainLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      
      <div className="max-w-4xl mx-auto px-4 text-left">
        {/* Header */}
        <section className="text-center py-10 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-luxury-beige/65 border border-[#E5D3B3]/40 text-[9px] tracking-[0.25em] uppercase font-semibold text-luxury-gold mb-6 mx-auto w-fit"
          >
            <Sparkles className="h-3 w-3" />
            Concierge Desk
          </motion.div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-luxury-dark mb-4">
            Private Inquiries
          </h1>
          <p className="text-xs text-luxury-muted max-w-md mx-auto leading-relaxed">
            Please get in touch with our concierge services for partner details or ticket booking support.
          </p>
        </section>

        {/* Info & Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Info Details */}
          <div className="flex flex-col justify-center">
            <h2 className="font-display font-semibold text-xl text-luxury-dark mb-6">Bhumika's EventSphere</h2>
            <p className="text-xs leading-relaxed text-luxury-muted mb-8 font-sans">
              For immediate questions regarding corporate bookings or private art gallery reservations, reach out using the coordinates below.
            </p>

            <div className="flex flex-col gap-6 text-xs text-luxury-muted font-medium">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-full bg-white border border-[#E5D3B3]/30 text-luxury-gold">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold block mb-0.5">Email</span>
                  <span className="text-luxury-dark">sharmabhumika773@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-full bg-white border border-[#E5D3B3]/30 text-luxury-gold">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold block mb-0.5">Concierge Phone</span>
                  <span className="text-luxury-dark">+91 98290 56789</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-full bg-white border border-[#E5D3B3]/30 text-luxury-gold">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold block mb-0.5">Business Address</span>
                  <span className="text-luxury-dark">Johri Bazar, Jaipur City, Rajasthan - 302003</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury">
            <h3 className="font-display font-semibold text-base text-luxury-dark mb-6">Send Message</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col text-left">
                <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-4 py-3 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Inquiry Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl p-4 text-xs text-luxury-dark focus:outline-none focus:border-luxury-gold"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Contact;
