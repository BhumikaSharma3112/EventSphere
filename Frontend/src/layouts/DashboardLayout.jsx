import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  User, Calendar, Ticket, Heart, Settings, LogOut, ShieldAlert,
  PlusCircle, BarChart3, Star, Bell, ShieldCheck, Users, FolderOpen,
  Menu, X, Sparkles, Home
} from 'lucide-react';
import CustomCursor from '../Components/CustomCursor';
import FloatingBackground from '../Components/FloatingBackground';

const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getMenuLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { label: 'Overview', path: '/admin', icon: BarChart3 },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Organizer Verification', path: '/admin/verification', icon: ShieldCheck },
        { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
        { label: 'Moderation Reports', path: '/admin/reports', icon: ShieldAlert },
        { label: 'Settings', path: '/admin/settings', icon: Settings }
      ];
    }

    if (user.role === 'organizer') {
      return [
        { label: 'Overview', path: '/organizer', icon: BarChart3 },
        { label: 'Create Event', path: '/organizer/create', icon: PlusCircle },
        { label: 'My Events', path: '/organizer/events', icon: Calendar },
        { label: 'My Tickets', path: '/dashboard/tickets', icon: Ticket },
        { label: 'Reviews', path: '/organizer/reviews', icon: Star },
        { label: 'Settings', path: '/organizer/settings', icon: Settings }
      ];
    }

    // Default Attendee links
    return [
      { label: 'Dashboard', path: '/dashboard', icon: User },
      { label: 'My Tickets', path: '/dashboard/tickets', icon: Ticket },
      { label: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
      { label: 'Profile Settings', path: '/dashboard/settings', icon: Settings }
    ];
  };

  const links = getMenuLinks();

  return (
    <div className="relative min-h-screen flex bg-luxury-cream text-luxury-dark selection:bg-luxury-blush-dark selection:text-luxury-dark">
      <CustomCursor />
      <FloatingBackground />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5D3B3]/40 p-6 z-20 shrink-0 relative">
        <Link to="/" className="flex items-center gap-2 mb-10 group">
          <Sparkles className="h-4.5 w-4.5 text-luxury-gold" />
          <span className="font-display text-lg tracking-[0.15em] font-semibold">EVENTSPHERE</span>
        </Link>

        {/* Links list */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-luxury-gold text-white shadow-sm'
                    : 'text-luxury-dark/80 hover:bg-luxury-blush/40 hover:text-luxury-gold'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom profile / logout */}
        <div className="border-t border-luxury-beige pt-6 mt-auto flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-luxury-dark hover:bg-luxury-blush/30 hover:text-luxury-gold transition-all">
            <Home className="h-4.5 w-4.5 shrink-0" />
            Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5D3B3]/20 flex items-center justify-between px-6 z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-luxury-gold" />
          <span className="font-display text-sm tracking-[0.15em] font-semibold">EVENTSPHERE</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-luxury-beige/40 hover:bg-luxury-beige text-luxury-dark cursor-pointer"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-luxury-dark/30 backdrop-blur-xs" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white border-r border-[#E5D3B3]/40 p-6 h-full z-50 animate-slide-right">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <span className="font-display text-base tracking-[0.15em] font-semibold">EVENTSPHERE</span>
            </Link>

            <nav className="flex flex-col gap-1.5 flex-grow">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-luxury-gold text-white'
                        : 'text-luxury-dark/80 hover:bg-luxury-blush/40 hover:text-luxury-gold'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-luxury-beige pt-6 mt-auto flex flex-col gap-4">
              <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-luxury-dark hover:bg-luxury-blush/30 transition-all">
                <Home className="h-4.5 w-4.5" />
                Public Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Dashboard Viewport Content */}
      <main className="flex-grow min-h-screen pt-20 md:pt-8 px-6 md:px-10 pb-12 z-10 relative overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;
