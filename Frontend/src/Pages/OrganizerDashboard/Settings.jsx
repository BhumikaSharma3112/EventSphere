import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import Toast from '../../Components/Toast';
import { User, Phone, BookOpen, Camera, Globe, Building } from 'lucide-react';
import { getImageUrl } from '../../services/api';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const parsePhone = (rawPhone) => {
    if (!rawPhone) return { code: '+91', num: '' };
    const parts = rawPhone.split(' ');
    if (parts.length > 1 && parts[0].startsWith('+')) {
      return { code: parts[0], num: parts.slice(1).join(' ') };
    }
    const prefixes = ['+91', '+1', '+44', '+971'];
    for (let prefix of prefixes) {
      if (rawPhone.startsWith(prefix)) {
        return { code: prefix, num: rawPhone.replace(prefix, '').trim() };
      }
    }
    return { code: '+91', num: rawPhone };
  };

  const initialPhone = parsePhone(user?.phone);
  const [name, setName] = useState(user?.name || '');
  const [countryCode, setCountryCode] = useState(initialPhone.code);
  const [phoneNum, setPhoneNum] = useState(initialPhone.num);
  const [bio, setBio] = useState(user?.bio || '');
  
  // Organizer specific
  const [businessName, setBusinessName] = useState(user?.verificationDocuments?.businessName || '');
  const [instagram, setInstagram] = useState(user?.socials?.instagram || '');
  const [website, setWebsite] = useState(user?.socials?.website || '');

  const [profilePic, setProfilePic] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullPhone = `${countryCode} ${phoneNum}`.trim();
    if (phoneNum) {
      const requiredLength = countryCode === '+91' || countryCode === '+1' ? 10 : countryCode === '+44' ? 11 : countryCode === '+971' ? 9 : 0;
      if (requiredLength && phoneNum.length !== requiredLength) {
        setToastType('error');
        setToastMsg(`Telephone number must be exactly ${requiredLength} digits for country code ${countryCode}.`);
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', fullPhone);
    formData.append('bio', bio);
    formData.append('businessName', businessName);
    formData.append('instagram', instagram);
    formData.append('website', website);
    
    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    const res = await dispatch(updateProfile(formData));
    setLoading(false);
    
    if (updateProfile.fulfilled.match(res)) {
      setToastType('success');
      setToastMsg('Profile and Business details updated.');
    } else {
      setToastType('error');
      setToastMsg(res.payload || 'Failed to update credentials.');
    }
  };

  return (
    <DashboardLayout>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      
      <div className="text-left mb-8">
        <h1 className="font-display font-semibold text-xl md:text-2xl text-luxury-dark mb-2">Curator Coordinates</h1>
        <p className="text-xs text-luxury-muted">
          Configure profile settings, edit hosting details, and verified socials.
        </p>
      </div>

      <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury max-w-xl text-left">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Profile pic upload */}
          <div className="flex items-center gap-6 pb-4 border-b border-luxury-beige">
            <div className="relative">
              <img
                src={profilePic ? URL.createObjectURL(profilePic) : getImageUrl(user?.profilePicture)}
                alt=""
                className="w-16 h-16 rounded-full object-cover border border-[#E5D3B3]"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-luxury-gold text-white rounded-full cursor-pointer hover:bg-luxury-gold-dark shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-luxury-dark">Curator Image</span>
              <span className="text-[10px] text-luxury-muted mt-0.5">JPEG or PNG. Max size 2MB.</span>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Full Name</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <User className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
                required
              />
            </div>
          </div>

          {/* Business Name */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Business Name</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <Building className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <input
                type="text"
                placeholder="Royal Jaipur Events"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Contact Telephone</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <Phone className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPhoneNum('');
                }}
                className="bg-transparent border-none text-xs focus:outline-none text-luxury-gold font-semibold pr-1.5 cursor-pointer shrink-0"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>
              <input
                type="text"
                pattern="\d*"
                placeholder={countryCode === '+91' || countryCode === '+1' ? "10-digit number" : countryCode === '+44' ? "11-digit number" : "9-digit number"}
                value={phoneNum}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const maxLength = countryCode === '+91' || countryCode === '+1' ? 10 : countryCode === '+44' ? 11 : countryCode === '+971' ? 9 : 15;
                  if (val.length <= maxLength) {
                    setPhoneNum(val);
                  }
                }}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
              />
            </div>
          </div>

          {/* Social Instagram */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Instagram handle</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-luxury-gold shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <input
                type="text"
                placeholder="@bhumika_sharma"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
              />
            </div>
          </div>

          {/* Social Website */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Website URL</label>
            <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <Globe className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
              <input
                type="text"
                placeholder="bhumikasharma.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Curator Biography</label>
            <div className="flex items-start gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
              <BookOpen className="h-4.5 w-4.5 text-luxury-gold shrink-0 mt-0.5" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? 'Saving Coordinates...' : 'Save Coordinates'}
          </button>
        </form>
      </div>

    </DashboardLayout>
  );
};

export default Settings;
