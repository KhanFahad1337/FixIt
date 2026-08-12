import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SessionExpiredModal({ show }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="auth-card" style={{ maxWidth: 400, width: '90%' }}>
        <div className="auth-header">
          <i className="bi bi-clock-history display-4"></i>
          <h4 className="mt-3 fw-bold">Session Expired</h4>
        </div>
        <div className="card-body p-4 text-center">
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your session has expired. Please log in again to continue.
          </p>
          <button className="btn btn-modern btn-modern-primary w-100 py-2" onClick={handleLogin}>
            <i className="bi bi-box-arrow-in-right me-2"></i>Login Again
          </button>
        </div>
      </div>
    </div>
  );
}
