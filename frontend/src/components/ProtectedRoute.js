import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly, staffOnly, customerOnly }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (staffOnly && !['admin', 'subadmin'].includes(user.role)) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  if (customerOnly && user.role === 'provider') return <Navigate to="/provider-dashboard" />;
  return children;
}
