import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import { Settings as SettingsIcon, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setToastMsg('Platform configuration settings saved.');
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Portal Settings</h1>
        <p className="text-xs text-luxury-muted">
          Configure general administrative properties and platform attributes.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury max-w-xl text-left">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="flex items-center gap-2 pb-4 border-b border-luxury-beige">
            <SettingsIcon className="w-5 h-5 text-luxury-gold" />
            <h3 className="font-display font-semibold text-sm text-luxury-dark">General Settings</h3>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-luxury-cream border border-luxury-beige rounded-2xl">
            <div>
              <span className="text-xs font-semibold text-luxury-dark block">Maintenance Mode</span>
              <span className="text-[10px] text-luxury-muted mt-0.5">Restrict attendee and curator registrations temporarily.</span>
            </div>
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="w-5 h-5 accent-luxury-gold cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Save Portal Options
          </button>
        </form>
      </div>

    </DashboardLayout>
  );
};

export default Settings;
