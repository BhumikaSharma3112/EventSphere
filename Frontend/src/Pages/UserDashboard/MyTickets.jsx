import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import TicketCard from '../../Components/TicketCard';
import API from '../../services/api';
import { Ticket } from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get('/tickets/my-tickets');
        setTickets(res.data.tickets || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDownload = async (ticketId) => {
    try {
      const response = await API.get(`/tickets/download/${ticketId}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EventSphere_Ticket_${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      window.open(`${backendHost}/api/tickets/download/${ticketId}`, '_blank');
    }
  };

  return (
    <DashboardLayout>
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">My Admission Passes</h1>
        <p className="text-xs text-luxury-muted">
          Your private ledger of active invitation credentials and event admissions.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-xs text-luxury-muted italic">Loading credentials...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8 flex flex-col items-center">
          <Ticket className="h-8 w-8 text-luxury-muted mb-2.5" />
          <p className="text-xs text-luxury-muted mb-2">No tickets found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {tickets.map((tkt) => (
            <TicketCard key={tkt._id} ticket={tkt} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTickets;
