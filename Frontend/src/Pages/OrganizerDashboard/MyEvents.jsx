import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import API from '../../services/api';
import { Calendar, Trash2, Edit3, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events?limit=100');
      const allEvents = res.data.events || [];
      const myEvents = allEvents.filter(e => e.organizer?._id === user?.id || e.organizer?._id === user?._id);
      setEvents(myEvents);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this curation listing?')) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">My Curations</h1>
        <p className="text-xs text-luxury-muted">
          Your active catalog listings. Review details or initiate attendee entry scanners.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-xs text-luxury-muted italic">Loading listings...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8">
          <p className="text-xs text-luxury-muted mb-2">No events curate listings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 text-left">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="bg-white border border-[#E5D3B3]/40 rounded-3xl p-5 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold mb-1 block">
                  {evt.category}
                </span>
                <h3 className="font-display font-semibold text-base text-luxury-dark mb-2">{evt.title}</h3>
                <div className="flex items-center gap-4 text-xs text-luxury-muted">
                  <span>{new Date(evt.date).toLocaleDateString()}</span>
                  <span>|</span>
                  <span>{evt.ticketsSold} / {evt.capacity} Passes Booked</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/organizer/attendees/${evt._id}`}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <QrCode className="h-4 w-4" />
                  Attendees & Check-In
                </Link>
                
                <button
                  onClick={() => handleDelete(evt._id)}
                  className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyEvents;
