import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/admin/reports');
      setReports(res.data.reports || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    setToastMsg('Report ticket resolved and updated.');
    // Simple state simulation
    setReports(reports.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Moderation Registry</h1>
        <p className="text-xs text-luxury-muted">
          Review flagged hosts, reported descriptions, and guest moderation requests.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury text-left">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="h-5 w-5 text-luxury-gold" />
          <h3 className="font-display font-semibold text-sm text-luxury-dark">Pending Disputes</h3>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-luxury-muted italic">Loading disputes...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10 bg-luxury-cream/30 border border-dashed border-luxury-beige rounded-2xl p-6 text-xs text-luxury-muted">
            <AlertTriangle className="h-6 w-6 text-luxury-gold mx-auto mb-2.5 opacity-60" />
            No moderation logs active currently.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-beige text-[10px] uppercase tracking-wider text-luxury-muted font-bold">
                  <th className="pb-3 pl-2">Reporter</th>
                  <th className="pb-3">Subject / Reason</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-luxury-beige/30 font-medium text-luxury-dark hover:bg-luxury-cream/30">
                    <td className="py-3.5 pl-2">{r.reporter?.name || 'Guest'}</td>
                    <td className="py-3.5">{r.reason}</td>
                    <td className="py-3.5 text-center font-bold text-luxury-gold capitalize">{r.status}</td>
                    <td className="py-3.5 text-right pr-2">
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleResolve(r._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-luxury-dark hover:bg-luxury-gold text-white text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Reports;
