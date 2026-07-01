import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import MainLayout from '../layouts/MainLayout';
import Toast from '../Components/Toast';
import { Mail, Lock, User, Sparkles, ArrowRight, Shield } from 'lucide-react';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const resultAction = await dispatch(registerUser({ name, email, password, role }));
    if (registerUser.fulfilled.match(resultAction)) {
      if (role === 'organizer') navigate('/organizer');
      else navigate('/dashboard');
    } else {
      setToastMsg(resultAction.payload || 'Registration failed.');
    }
  };

  return (
    <MainLayout>
      <Toast message={toastMsg} type="error" onClose={() => setToastMsg('')} />
      
      <div className="max-w-md mx-auto py-12 px-4 text-left">
        <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury">
          
          <div className="flex flex-col items-center text-center mb-8">
            <Sparkles className="h-6 w-6 text-luxury-gold mb-3 animate-pulse" />
            <h1 className="font-display font-semibold text-xl text-luxury-dark mb-2">Create Account</h1>
            <p className="text-xs text-luxury-muted max-w-[240px]">
              Begin your seasonal curation journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
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

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Email Address</label>
              <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
                <Mail className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Password</label>
              <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
                <Lock className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium"
                  required
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="flex flex-col">
              <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Account Role</label>
              <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
                <Shield className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent border-none text-xs focus:outline-none text-luxury-dark font-medium cursor-pointer"
                >
                  <option value="user">Guest (Attendee)</option>
                  <option value="organizer">Curator (Organizer)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Register'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-xs text-luxury-muted">Already curation partner? </span>
            <Link to="/login" className="text-xs text-luxury-gold hover:text-luxury-gold-dark font-semibold">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;