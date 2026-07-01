import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import API from '../../services/api';
import { Users, UserX, UserCheck } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await API.put(`/admin/block/${userId}`);
      setToastType('success');
      setToastMsg(res.data.message);
      
      // Update local state
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: res.data.user.isBlocked } : u));
    } catch (err) {
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">User Directory</h1>
        <p className="text-xs text-luxury-muted">
          Manage platform members. Suspend accounts violating community guidelines.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-6 shadow-luxury text-left">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-luxury-gold" />
          <h3 className="font-display font-semibold text-sm text-luxury-dark">Registered Accounts</h3>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-luxury-muted italic">Loading members...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-6 text-xs text-luxury-muted italic">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-beige text-[10px] uppercase tracking-wider text-luxury-muted font-bold">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-luxury-beige/30 font-medium text-luxury-dark hover:bg-luxury-cream/30">
                    <td className="py-3.5 pl-2">{u.name}</td>
                    <td className="py-3.5">{u.email}</td>
                    <td className="py-3.5 capitalize font-semibold text-luxury-gold">{u.role}</td>
                    <td className="py-3.5 text-center">
                      {u.isBlocked ? (
                        <span className="text-[10px] text-red-600 font-semibold px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
                          Suspended
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ml-auto ${
                            u.isBlocked 
                              ? 'bg-emerald-55 border border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                              : 'bg-red-50 border border-red-100 text-red-500 hover:bg-red-100'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Activate
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              Suspend
                            </>
                          )}
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

export default UserManagement;
