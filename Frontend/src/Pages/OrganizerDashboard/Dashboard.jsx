import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import { SalesAreaChart } from '../../Components/Charts';
import API from '../../services/api';
import { Calendar, Users, IndianRupee, Award, PlusCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeEventsCount: 0,
    totalCapacity: 0,
    ticketsSold: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const eventRes = await API.get('/events?limit=100'); // load events
        const allEvents = eventRes.data.events || [];
        const myEvents = allEvents.filter(e => e.organizer?._id === user?.id || e.organizer?._id === user?._id);
        
        setEvents(myEvents);
        
        // Sum values
        const activeEventsCount = myEvents.length;
        const totalCapacity = myEvents.reduce((sum, e) => sum + Math.max(0, e.capacity || 0), 0);
        const ticketsSold = myEvents.reduce((sum, e) => sum + Math.max(0, e.ticketsSold || 0), 0);
        const totalSales = myEvents.reduce((sum, e) => sum + (Math.max(0, e.ticketsSold || 0) * Math.max(0, e.price || 0)), 0);
        
        setStats({
          totalSales,
          activeEventsCount,
          totalCapacity,
          ticketsSold
        });

        // Set mock sales chart data based on sales (clamped to prevent negative graphs)
        const safeSales = Math.max(0, totalSales);
        setSalesData([
          { date: 'Mon', sales: Math.round(safeSales * 0.1) },
          { date: 'Tue', sales: Math.round(safeSales * 0.15) },
          { date: 'Wed', sales: Math.round(safeSales * 0.12) },
          { date: 'Thu', sales: Math.round(safeSales * 0.18) },
          { date: 'Fri', sales: Math.round(safeSales * 0.22) },
          { date: 'Sat', sales: Math.round(safeSales * 0.15) },
          { date: 'Sun', sales: Math.round(safeSales * 0.08) }
        ]);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, [user]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-1">
            Curator Dashboard
          </h1>
          <p className="text-xs text-luxury-muted">
            Manage your high-end schedules, monitor booking conversions, and check-in guests.
          </p>
        </div>
        <Link
          to="/organizer/create"
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm shrink-0 w-fit cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Curate Event
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <IndianRupee className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Gross Sales</span>
          <span className="font-display text-xl font-bold text-luxury-dark">₹{Math.max(0, stats.totalSales)}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Calendar className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Curation Listings</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.activeEventsCount}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Users className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Passes Sold</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.ticketsSold}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <CheckCircle className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Max Platform Capacity</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.totalCapacity}</span>
        </div>
      </div>

      {/* Charts Segment */}
      <div className="bg-white border border-[#E5D3B3]/45 rounded-[32px] p-6 shadow-luxury mb-8 text-left">
        <h3 className="font-display font-semibold text-sm text-luxury-dark mb-6">Revenue Conversions</h3>
        <SalesAreaChart data={salesData} />
      </div>

      {/* Recent events list */}
      <div className="text-left">
        <h2 className="font-display text-base font-semibold text-luxury-dark mb-6">Recent Curations</h2>
        
        {loading ? (
          <div className="text-center py-10 text-xs text-luxury-muted italic">Loading listings...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white/45 border border-dashed border-[#E5D3B3]/40 rounded-3xl p-8">
            <p className="text-xs text-luxury-muted mb-4">No events created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((evt) => (
              <div key={evt._id} className="bg-white border border-luxury-beige rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold mb-1 block">
                    {evt.category}
                  </span>
                  <h4 className="font-display font-semibold text-sm text-luxury-dark mb-1 line-clamp-1">
                    {evt.title}
                  </h4>
                  <p className="text-[10px] text-luxury-muted mb-3">
                    {new Date(evt.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-luxury-beige pt-3 mt-2">
                  <span className="text-xs text-luxury-muted">{evt.ticketsSold} / {evt.capacity} Sold</span>
                  <Link
                    to={`/organizer/attendees/${evt._id}`}
                    className="text-[10px] uppercase font-bold text-luxury-gold hover:underline"
                  >
                    Scan Guests
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
