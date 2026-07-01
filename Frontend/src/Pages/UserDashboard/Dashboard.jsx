import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import TicketCard from '../../Components/TicketCard';
import API from '../../services/api';
import { Calendar, Heart, Ticket, User, Sparkles } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await API.get('/tickets/my-tickets');
        setTickets(res.data.tickets || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const handleDownload = async (ticketId) => {
    const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.open(`${backendHost}/api/tickets/download/${ticketId}`, '_blank');
  };

  const activeTickets = tickets.filter(t => !t.isCheckedIn);

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-6.5 shadow-luxury flex items-center justify-between gap-6 mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 mb-2 text-luxury-gold">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] tracking-widest uppercase font-semibold">Attendee Portal</span>
          </div>
          <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-luxury-muted max-w-md">
            Review your active passes, download invitations as premium PDFs, or update your profile credentials.
          </p>
        </div>
        <img 
          src={getImageUrl(user?.profilePicture)} 
          alt="" 
          className="h-16 w-16 rounded-full object-cover border border-[#E5D3B3]"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Ticket className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Active Passes</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{activeTickets.length}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Calendar className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Attended Events</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{tickets.length - activeTickets.length}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Heart className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Wishlisted</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{user?.wishlist?.length || 0}</span>
        </div>
      </div>

      {/* Recent Passes grid */}
      <div className="text-left">
        <h2 className="font-display text-base font-semibold text-luxury-dark mb-6">Recent Admission Passes</h2>
        
        {loading ? (
          <div className="text-center py-10 text-xs text-luxury-muted italic">Loading passes...</div>
        ) : activeTickets.length === 0 ? (
          <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8 flex flex-col items-center">
            <Ticket className="h-8 w-8 text-luxury-muted mb-2.5" />
            <p className="text-xs text-luxury-muted mb-3.5">You have no active passes currently.</p>
            <Link to="/events" className="px-5 py-2.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-dark text-white text-[11px] font-semibold uppercase tracking-wider transition-all shadow-sm">
              Book First Pass
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeTickets.slice(0, 2).map((tkt) => (
              <TicketCard key={tkt._id} ticket={tkt} onDownload={handleDownload} />
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
