import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import QRScanner from '../../Components/QRScanner';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const Attendees = () => {
  const { eventId } = useParams();
  
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    try {
      const res = await API.get(`/tickets/event/${eventId}`);
      setAttendees(res.data.attendees || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleQRScan = async (code) => {
    try {
      const res = await API.post('/tickets/check-in', { ticketCode: code });
      setToastType('success');
      setToastMsg(res.data.message || 'Check-in successful!');
      
      // Reload list to show check-in state
      fetchAttendees();
    } catch (err) {
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Check-in failed. Invalid pass credentials.');
    }
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Event Attendees & QR Check-In</h1>
        <p className="text-xs text-luxury-muted">
          Initiate the camera scanner to admit guests, or view the complete registration logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* QR Scanner */}
        <div className="lg:col-span-1">
          <QRScanner onScan={handleQRScan} attendees={attendees} />
        </div>

        {/* Attendance Registry Table */}
        <div className="lg:col-span-2 bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury text-left">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-luxury-gold" />
            <h3 className="font-display font-semibold text-sm text-luxury-dark">Guest Registry</h3>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-luxury-muted italic">Loading attendees...</div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-10 text-xs text-luxury-muted italic">
              No tickets booked yet for this event curation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-luxury-beige text-[10px] uppercase tracking-wider text-luxury-muted font-bold">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-2">Admitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((att) => {
                    const userName = att.user?.name || 'Anonymous';
                    const userEmail = att.user?.email || 'N/A';
                    
                    return (
                      <tr key={att._id} className="border-b border-luxury-beige/30 font-medium text-luxury-dark hover:bg-luxury-cream/30">
                        <td className="py-3.5 pl-2">{userName}</td>
                        <td className="py-3.5">{userEmail}</td>
                        <td className="py-3.5 flex items-center justify-center">
                          {att.isCheckedIn ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                              Admitted
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right pr-2 text-luxury-muted">
                          {att.checkedInAt ? new Date(att.checkedInAt).toLocaleTimeString() : '--:--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Attendees;
