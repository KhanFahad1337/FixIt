import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import SessionExpiredModal from './components/SessionExpiredModal';
import AppSidebar from './components/AppSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Providers from './pages/Providers';
import ProviderDetail from './pages/ProviderDetail';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import Invoice from './pages/Invoice';
import Profile from './pages/Profile';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderEditProfile from './pages/ProviderEditProfile';
import Review from './pages/Review';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import AiTools from './pages/AiTools';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const sidebarRoutes = ['/', '/services', '/ai-tools', '/my-bookings', '/favorites', '/profile', '/provider-dashboard', '/provider-edit-profile', '/admin', '/invoice', '/review', '/payment', '/book'];
  const showSidebar = user && sidebarRoutes.some(r => location.pathname.startsWith(r));

  const content = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:category" element={<Providers />} />
      <Route path="/provider/:id" element={<ProviderDetail />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider-edit-profile" element={<ProtectedRoute><ProviderEditProfile /></ProtectedRoute>} />
      <Route path="/book/:providerId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/payment/:bookingId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
      <Route path="/review/:id" element={<ProtectedRoute><Review /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/ai-tools" element={<AiTools />} />
      <Route path="/admin" element={<ProtectedRoute staffOnly><Admin /></ProtectedRoute>} />
    </Routes>
  );

  return (
    <div className="container mt-4 mb-5">
      {showSidebar ? (
        <div className="app-layout">
          <AppSidebar />
          <div className="app-content">{content}</div>
        </div>
      ) : content}
    </div>
  );
}

function App() {
  const { sessionExpired } = useAuth();
  return (
    <ThemeProvider>
      <SessionExpiredModal show={sessionExpired} />
      <Navbar />
      <AppContent />
      <ChatBot />
    </ThemeProvider>
  );
}

export default App;
