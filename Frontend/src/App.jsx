import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './Pages/Home';
import Events from './Pages/Events';
import EventDetails from './Pages/EventDetails';
import OrganizerProfile from './Pages/OrganizerProfile';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/login';
import Signup from './Pages/signup';
import ForgotPassword from './Pages/ForgotPassword';
import NotFound from './Pages/NotFound';

// User Dashboard Pages
import UserDashboard from './Pages/UserDashboard/Dashboard';
import MyTickets from './Pages/UserDashboard/MyTickets';
import Wishlist from './Pages/UserDashboard/Wishlist';
import UserSettings from './Pages/UserDashboard/Settings';

// Organizer Dashboard Pages
import OrganizerDashboard from './Pages/OrganizerDashboard/Dashboard';
import CreateEvent from './Pages/OrganizerDashboard/CreateEvent';
import MyEvents from './Pages/OrganizerDashboard/MyEvents';
import AttendeesCheckIn from './Pages/OrganizerDashboard/Attendees';
import OrganizerReviews from './Pages/OrganizerDashboard/Reviews';
import OrganizerSettings from './Pages/OrganizerDashboard/Settings';

// Admin Dashboard Pages
import AdminDashboard from './Pages/AdminDashboard/Dashboard';
import UserManagement from './Pages/AdminDashboard/UserManagement';
import OrganizerVerification from './Pages/AdminDashboard/OrganizerVerification';
import CategoriesAdmin from './Pages/AdminDashboard/Categories';
import ReportsAdmin from './Pages/AdminDashboard/Reports';
import AdminSettings from './Pages/AdminDashboard/Settings';

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/explore" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/organizer/:organizerId" element={<OrganizerProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Attendee User Dashboards */}
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/dashboard/tickets" element={<MyTickets />} />
      <Route path="/dashboard/wishlist" element={<Wishlist />} />
      <Route path="/dashboard/settings" element={<UserSettings />} />

      {/* Organizer Dashboards */}
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/organizer/create" element={<CreateEvent />} />
      <Route path="/organizer/events" element={<MyEvents />} />
      <Route path="/organizer/attendees/:eventId" element={<AttendeesCheckIn />} />
      <Route path="/organizer/reviews" element={<OrganizerReviews />} />
      <Route path="/organizer/settings" element={<OrganizerSettings />} />

      {/* Admin Dashboards */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/verification" element={<OrganizerVerification />} />
      <Route path="/admin/categories" element={<CategoriesAdmin />} />
      <Route path="/admin/reports" element={<ReportsAdmin />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      {/* 404 Page Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;