import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchNotifications, markNotificationsRead } from '../redux/slices/notificationSlice';
import { Menu, X, Bell, User, Calendar, Ticket, Heart, Settings, LogOut, Award, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { getImageUrl } from '../services/api';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleMarkNotifRead = () => {
    dispatch(markNotificationsRead());
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'organizer') return '/organizer';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="glass-panel sticky top-0 left-0 w-full z-50 border-b border-[#E5D3B3]/30 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Elegant Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/favicon.svg" alt="EventSphere Logo" className="h-5.5 w-5.5 object-contain transition-transform duration-500 group-hover:rotate-12" />
          <span className="font-display text-2xl tracking-[0.15em] font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors duration-300">
            EVENTSPHERE
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm tracking-widest uppercase font-medium hover:text-luxury-gold transition-colors duration-300 ${
                location.pathname === link.path ? 'text-luxury-gold border-b border-luxury-gold/50' : 'text-luxury-dark/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-5">
          
          {/* Notifications Center */}
          {isAuthenticated && (
            <div ref={notifRef} className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 rounded-full text-luxury-dark/80 hover:text-luxury-gold hover:bg-luxury-blush transition-all duration-300 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-luxury-gold text-white font-sans text-[10px] flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-luxury-lg border border-[#E5D3B3]/40 p-4 max-h-[400px] overflow-y-auto animate-fade-in z-50">
                  <div className="flex items-center justify-between border-b border-luxury-beige pb-2 mb-3">
                    <span className="font-display font-semibold text-sm text-luxury-dark">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkNotifRead}
                        className="text-xs text-luxury-gold hover:text-luxury-gold-dark font-medium cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-luxury-muted">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            notif.isRead 
                              ? 'bg-transparent border-transparent text-luxury-muted' 
                              : 'bg-luxury-blush/25 border-luxury-blush-dark/30 text-luxury-dark font-medium'
                          }`}
                        >
                          <div className="font-semibold text-luxury-dark text-[13px] mb-0.5">{notif.title}</div>
                          <div>{notif.message}</div>
                          <div className="text-[10px] text-luxury-muted mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Account / Profile Dropdown */}
          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-luxury-beige/40 hover:bg-luxury-beige/80 border border-[#E5D3B3]/20 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={getImageUrl(user?.profilePicture)}
                  alt={user?.name}
                  className="h-7 w-7 rounded-full object-cover border border-[#E5D3B3]"
                />
                <span className="hidden sm:inline font-sans text-xs font-semibold text-luxury-dark">
                  {user?.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-luxury-lg border border-[#E5D3B3]/40 py-2.5 z-50">
                  <div className="px-4 py-2 border-b border-luxury-beige mb-2">
                    <div className="font-semibold text-sm text-luxury-dark truncate">{user?.name}</div>
                    <div className="text-xs text-luxury-muted truncate capitalize">{user?.role}</div>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-luxury-dark hover:bg-luxury-blush/30 hover:text-luxury-gold transition-all"
                  >
                    <Calendar className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {user?.role === 'user' && (
                    <>
                      <Link
                        to="/dashboard/tickets"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-luxury-dark hover:bg-luxury-blush/30 hover:text-luxury-gold transition-all"
                      >
                        <Ticket className="h-4 w-4" />
                        My Tickets
                      </Link>
                      <Link
                        to="/dashboard/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-luxury-dark hover:bg-luxury-blush/30 hover:text-luxury-gold transition-all"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </>
                  )}

                  <Link
                    to={`${getDashboardLink()}/settings`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-luxury-dark hover:bg-luxury-blush/30 hover:text-luxury-gold transition-all"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-all border-t border-luxury-beige mt-2 pt-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs tracking-widest uppercase font-semibold text-luxury-dark hover:text-luxury-gold transition-all"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-xs tracking-widest uppercase font-semibold px-5 py-2.5 rounded-full border border-luxury-gold text-luxury-dark bg-transparent hover:bg-luxury-gold hover:text-white transition-all duration-300"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Burger Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-luxury-dark/80 hover:bg-luxury-beige transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#E5D3B3]/20 flex flex-col gap-4 animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-xs tracking-wider uppercase font-semibold text-luxury-dark hover:text-luxury-gold px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex flex-col gap-2.5 pt-2 border-t border-luxury-beige">
              <Link
                to="/login"
                className="text-center text-xs tracking-wider uppercase font-semibold text-luxury-dark py-2 rounded-xl bg-luxury-beige"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-center text-xs tracking-wider uppercase font-semibold bg-luxury-gold text-white py-2.5 rounded-xl"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
