import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${API}/providers/${user._id}`).then(res => setProvider(res.data)).catch(() => {});
    axios.get(`${API}/bookings/provider/${user._id}`).then(res => setBookings(res.data)).catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.put(`${API}/providers/${user._id}`, { isAvailable: !provider.isAvailable });
      setProvider(res.data);
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  const earnings = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0);
  const completed = bookings.filter(b => b.status === 'completed').length;
  const pending = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-person-badge me-2" style={{ color: 'var(--primary)' }}></i>
            Provider Dashboard
          </h2>
          <p className="text-muted mb-0">{provider?.name} · {provider?.profession}</p>
        </div>
        <button className={`btn ${provider?.isAvailable ? 'btn-success' : 'btn-secondary'} btn-modern`}
          onClick={toggleAvailability}>
          <i className={`bi ${provider?.isAvailable ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
          {provider?.isAvailable ? 'Available' : 'Unavailable'}
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card card-gradient">
            <i className="bi bi-calendar-check stat-icon"></i>
            <h2 className="fw-bold">{bookings.length}</h2>
            <p className="mb-0 opacity-80">Total Bookings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card card-gradient-2">
            <i className="bi bi-check-circle stat-icon"></i>
            <h2 className="fw-bold">{completed}</h2>
            <p className="mb-0 opacity-80">Completed</p>
          </div>
        </div>
          <div className="col-md-3">
            <div className="stat-card" style={{ background: 'var(--warning)', color: 'var(--text-white)' }}>
              <i className="bi bi-hourglass-split stat-icon"></i>
              <h2 className="fw-bold">{pending}</h2>
              <p className="mb-0 opacity-80">Pending</p>
            </div>
          </div>
        <div className="col-md-3">
          <div className="stat-card card-gradient-3">
            <i className="bi bi-currency-dollar stat-icon"></i>
            <h2 className="fw-bold">${earnings.toFixed(2)}</h2>
            <p className="mb-0 opacity-80">Earnings</p>
          </div>
        </div>
      </div>

      <div className="card-modern">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-list-check me-2" style={{ color: 'var(--primary)' }}></i>
            My Bookings
          </h5>
          {bookings.length === 0 ? (
            <div className="text-center py-4 text-muted">No bookings yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>Client</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.user?.name}</td>
                      <td>{b.service?.name || 'Service'}</td>
                      <td>{new Date(b.date).toLocaleDateString()} {b.time}</td>
                      <td className="fw-bold" style={{ color: 'var(--primary)' }}>${b.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${b.status === 'completed' ? 'badge-modern-success' : b.status === 'cancelled' ? 'badge-modern-danger' : b.status === 'in_progress' ? 'badge-modern-primary' : 'badge-modern-warning'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === 'pending' && (
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={() => updateStatus(b._id, 'confirmed')}>
                              <i className="bi bi-check me-1"></i>Accept
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(b._id, 'cancelled')}>
                              <i className="bi bi-x me-1"></i>Decline
                            </button>
                          </div>
                        )}
                        {b.status === 'confirmed' && (
                          <button className="btn btn-sm btn-primary" onClick={() => updateStatus(b._id, 'in_progress')}>
                            <i className="bi bi-play me-1"></i>Start
                          </button>
                        )}
                        {b.status === 'in_progress' && (
                          <button className="btn btn-sm btn-success" onClick={() => updateStatus(b._id, 'completed')}>
                            <i className="bi bi-check-all me-1"></i>Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
