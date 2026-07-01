import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Toast from '../Components/Toast';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMsg('If your email exists, a password reset link has been dispatched.');
      setEmail('');
    }, 1500);
  };

  return (
    <MainLayout>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      
      <div className="max-w-md mx-auto py-16 px-4 text-left">
        <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury">
          
          <div className="flex flex-col items-center text-center mb-8">
            <Sparkles className="h-6 w-6 text-luxury-gold mb-3" />
            <h1 className="font-display font-semibold text-xl text-luxury-dark mb-2">Recover Access</h1>
            <p className="text-xs text-luxury-muted max-w-[240px]">
              Provide your email to receive recovery instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? 'Sending...' : 'Send Recovery Link'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-xs text-luxury-muted hover:text-luxury-gold font-medium">
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
