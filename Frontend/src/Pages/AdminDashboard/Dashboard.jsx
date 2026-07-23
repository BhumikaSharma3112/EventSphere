import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { SalesAreaChart, CategoryPieChart } from '../../Components/Charts';
import API from '../../services/api';
import { Users, IndianRupee, Calendar, ShieldCheck, Heart } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalRevenue: 0
  });
  
  const [categoryData, setCategoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await API.get('/admin/analytics');
        setStats(res.data.stats || {});
        setCategoryData(res.data.charts?.categories || []);
        setSalesData(res.data.charts?.sales || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Platform Administration</h1>
        <p className="text-xs text-luxury-muted">
          Review platform statistics, monitor category registrations, and manage verified curators.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <IndianRupee className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Platform Revenue</span>
          <span className="font-display text-xl font-bold text-luxury-dark">₹{Math.max(0, stats.totalRevenue)}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Calendar className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Platform Events</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.totalEvents}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <Users className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Total Guests</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.totalUsers}</span>
        </div>

        <div className="bg-white border border-[#E5D3B3]/35 rounded-3xl p-5 shadow-luxury">
          <ShieldCheck className="h-5 w-5 text-luxury-gold mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-luxury-muted block">Verified Organizers</span>
          <span className="font-display text-xl font-bold text-luxury-dark">{stats.totalOrganizers}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
        {/* Category distribution pie */}
        <div className="lg:col-span-1 bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury">
          <h3 className="font-display font-semibold text-sm text-luxury-dark mb-4 text-center">Category Distribution</h3>
          {loading ? (
            <div className="text-center py-10 text-xs italic text-luxury-muted">Loading chart...</div>
          ) : (
            <CategoryPieChart data={categoryData} />
          )}
        </div>

        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury">
          <h3 className="font-display font-semibold text-sm text-luxury-dark mb-4">Gross Platform Sales</h3>
          {loading ? (
            <div className="text-center py-10 text-xs italic text-luxury-muted">Loading chart...</div>
          ) : (
            <SalesAreaChart data={salesData} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
