import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './redux/slices/authSlice';

// Route Protection
import ProtectedRoute from './Components/ProtectedRoute';

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
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

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

      {/* Attendee User Dashboards (Protected, allowed role: 'user') */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/tickets" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <MyTickets />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/wishlist" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Wishlist />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/settings" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserSettings />
          </ProtectedRoute>
        } 
      />

      {/* Organizer Dashboards (Protected, allowed role: 'organizer') */}
      <Route 
        path="/organizer" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer/create" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <CreateEvent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer/events" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <MyEvents />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer/attendees/:eventId" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <AttendeesCheckIn />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer/reviews" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerReviews />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer/settings" 
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerSettings />
          </ProtectedRoute>
        } 
      />

      {/* Admin Dashboards (Protected, allowed role: 'admin') */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/verification" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrganizerVerification />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CategoriesAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ReportsAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } 
      />

      {/* 404 Page Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;