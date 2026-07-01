import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { ShieldCheck, Award, FileText } from 'lucide-react';

const OrganizerVerification = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const res = await API.get('/admin/users');
      const allUsers = res.data.users || [];
      const orgs = allUsers.filter(u => u.role === 'organizer');
      setOrganizers(orgs);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/approve/${id}`);
      setToastMsg(res.data.message);
      
      // Update local state
      setOrganizers(organizers.map(o => o._id === id ? { ...o, isVerifiedOrganizer: true } : o));
    } catch (err) {
      setToastMsg('Approval failed.');
    }
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Curator Verification</h1>
        <p className="text-xs text-luxury-muted">
          Moderate submitted documentation credentials and approve elite verified hosting statuses.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury text-left">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="h-5 w-5 text-luxury-gold" />
          <h3 className="font-display font-semibold text-sm text-luxury-dark">Curators Logs</h3>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-luxury-muted italic">Loading log...</div>
        ) : organizers.length === 0 ? (
          <div className="text-center py-6 text-xs text-luxury-muted italic">No curators registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-beige text-[10px] uppercase tracking-wider text-luxury-muted font-bold">
                  <th className="pb-3 pl-2">Curator Name</th>
                  <th className="pb-3">Business name</th>
                  <th className="pb-3">License submitted</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((o) => {
                  const bizName = o.verificationDocuments?.businessName || 'Independent Curator';
                  const lic = o.verificationDocuments?.businessLicense || 'LIC-10029-PENDING';
                  return (
                    <tr key={o._id} className="border-b border-luxury-beige/30 font-medium text-luxury-dark hover:bg-luxury-cream/30">
                      <td className="py-3.5 pl-2">{o.name}</td>
                      <td className="py-3.5">{bizName}</td>
                      <td className="py-3.5 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>{lic}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        {o.isVerifiedOrganizer ? (
                          <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        {!o.isVerifiedOrganizer && (
                          <button
                            onClick={() => handleApprove(o._id)}
                            className="px-3.5 py-1.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-[10px] font-bold uppercase transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default OrganizerVerification;
