import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, sendOTP, clearError } from '../redux/slices/authSlice';
import MainLayout from '../layouts/MainLayout';
import Toast from '../Components/Toast';
import { Mail, Lock, User, Sparkles, ArrowRight, Shield, Key } from 'lucide-react';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [otp, setOtp] = useState('');

  // Step wizard & countdown states
  const [step, setStep] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('error');
  const [timer, setTimer] = useState(0);

  // Timer countdown hook for Resend Code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Step 1: Send Verification Code
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToastType('error');
      setToastMsg('Please fill in all details.');
      return;
    }

    setLocalLoading(true);
    dispatch(clearError());

    const resultAction = await dispatch(sendOTP({ email }));
    setLocalLoading(false);

    if (sendOTP.fulfilled.match(resultAction)) {
      setToastType('success');
      setToastMsg('Verification OTP code sent to your email.');
      setStep(2);
      setTimer(60); // 60 seconds resend countdown
    } else {
      setToastType('error');
      setToastMsg(resultAction.payload || 'Failed to send verification code.');
    }
  };

  // Handle Step 2: Verify & Register
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (!otp) {
      setToastType('error');
      setToastMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLocalLoading(true);
    dispatch(clearError());

    const resultAction = await dispatch(registerUser({ name, email, password, role, otp }));
    setLocalLoading(false);

    if (registerUser.fulfilled.match(resultAction)) {
      if (role === 'organizer') navigate('/organizer');
      else navigate('/dashboard');
    } else {
      setToastType('error');
      setToastMsg(resultAction.payload || 'Registration failed.');
    }
  };

  // Resend OTP code action
  const handleResend = async () => {
    if (timer > 0) return;
    dispatch(clearError());
    setLocalLoading(true);
    const resultAction = await dispatch(sendOTP({ email }));
    setLocalLoading(false);

    if (sendOTP.fulfilled.match(resultAction)) {
      setToastType('success');
      setToastMsg('A new verification code was sent to your inbox.');
      setTimer(60);
    } else {
      setToastType('error');
      setToastMsg(resultAction.payload || 'Failed to resend code.');
    }
  };

  return (
    <MainLayout>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      
      <div className="max-w-md mx-auto py-12 px-4 text-left">
        <div className="bg-white border border-[#E5D3B3]/45 rounded-3xl p-8 shadow-luxury">
          
          <div className="flex flex-col items-center text-center mb-8">
            <Sparkles className="h-6 w-6 text-luxury-gold mb-3 animate-pulse" />
            <h1 className="font-display font-semibold text-xl text-luxury-dark mb-2">Create Account</h1>
            <p className="text-xs text-luxury-muted max-w-[240px]">
              {step === 1 ? 'Begin your seasonal curation journey.' : 'Verify your email address to continue.'}
            </p>
          </div>

          {step === 1 ? (
            /* Step 1 Form: Details Collection */
            <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Full Name</label>
                <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
                  <User className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Evelyn Vance"
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
                    placeholder="evelyn@eventsphere.com"
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
                    placeholder="••••••••"
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
                disabled={localLoading}
                className="w-full mt-4 py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {localLoading ? 'Sending Code...' : 'Send Verification Code'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            /* Step 2 Form: OTP Verification code */
            <form onSubmit={handleSubmitRegister} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className="text-[9px] tracking-widest uppercase font-semibold text-luxury-gold mb-1.5 pl-1">Verification OTP</label>
                <div className="flex items-center gap-2 bg-luxury-cream border border-[#E5D3B3]/40 rounded-xl px-3.5 py-3">
                  <Key className="h-4.5 w-4.5 text-luxury-gold shrink-0" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full bg-transparent border-none text-xs tracking-[0.2em] font-bold focus:outline-none text-luxury-dark text-center"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={localLoading || loading}
                className="w-full py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-dark text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {localLoading || loading ? 'Verifying & Registering...' : 'Verify & Sign Up'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-[10px] text-luxury-muted">
                  Didn't receive the email? Check spam folder.
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    timer > 0 ? 'text-luxury-muted' : 'text-luxury-gold hover:text-luxury-gold-dark'
                  }`}
                >
                  {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] text-luxury-muted hover:text-luxury-dark transition-all text-center underline"
              >
                Go back to details
              </button>
            </form>
          )}

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