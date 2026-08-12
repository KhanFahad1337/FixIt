import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReportNoShow from '../components/ReportNoShow';

import API from '../config';

const statusColors = {
  pending: { bg: 'badge-modern-warning', icon: 'bi-clock' },
  confirmed: { bg: 'badge-modern-info', icon: 'bi-check2' },
  in_progress: { bg: 'badge-modern-primary', icon: 'bi-arrow-repeat' },
  completed: { bg: 'badge-modern-success', icon: 'bi-check2-all' },
  cancelled: { bg: 'badge-modern-danger', icon: 'bi-x' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportBooking, setReportBooking] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = () => {
    axios.get(`${API}/bookings/my`)
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.put(`${API}/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="loading-spinner mx-auto"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-4">
        <div className="p-3 rounded-3 me-3" style={{ background: 'var(--primary-light)' }}>
          <i className="bi bi-list-check fs-4" style={{ color: 'var(--primary)' }}></i>
        </div>
        <div>
          <h2 className="fw-bold mb-1">My Bookings</h2>
          <p className="text-muted mb-0">{bookings.length} booking(s)</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-calendar-x"></i></div>
          <h5 className="fw-bold">No bookings yet</h5>
          <p className="text-muted">Browse services and book your first appointment.</p>
          <a href="/services" className="btn btn-modern btn-modern-primary">Browse Services</a>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-modern">
            <thead>
              <tr>
                <th>Service</th>
                <th>Provider</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} className="animate-fade-in-up">
                  <td className="fw-semibold">{b.service?.name || 'Service'}</td>
                  <td>{b.provider?.name}</td>
                  <td>{new Date(b.date).toLocaleDateString()} <span className="text-muted">{b.time}</span></td>
                  <td className="fw-bold" style={{ color: 'var(--primary)' }}>${b.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusColors[b.status]?.bg || 'badge-modern-info'}`}>
                      <i className={`${statusColors[b.status]?.icon || 'bi-info'} me-1`}></i>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-modern-success' : 'badge-modern-warning'}`}>
                      {b.paymentStatus === 'paid' ? <i className="bi bi-check-circle me-1"></i> : <i className="bi bi-hourglass me-1"></i>}
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-modern btn-modern-outline btn-sm me-1"
                      onClick={() => navigate(`/invoice/${b._id}`)}>
                      <i className="bi bi-receipt me-1"></i>Invoice
                    </button>
                    {b.status === 'pending' && (
                      <>
                        {b.paymentStatus !== 'paid' && (
                          <button className="btn btn-modern btn-modern-primary btn-sm me-1"
                            onClick={() => navigate(`/payment/${b._id}`)}>
                            <i className="bi bi-credit-card me-1"></i>Pay
                          </button>
                        )}
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => cancelBooking(b._id)}>
                          <i className="bi bi-x-circle me-1"></i>Cancel
                        </button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="btn btn-outline-warning btn-sm"
                        onClick={() => setReportBooking(b)}>
                        <i className="bi bi-exclamation-triangle me-1"></i>No-Show
                      </button>
                    )}
                    {b.status === 'completed' && !b.hasReviewed && (
                      <button className="btn btn-modern btn-modern-secondary btn-sm"
                        onClick={() => navigate(`/review/${b._id}`)}>
                        <i className="bi bi-star me-1"></i>Review
                      </button>
                    )}
                    {b.status === 'completed' && b.hasReviewed && (
                      <button className="btn btn-sm btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <i className="bi bi-check2 me-1"></i>Reviewed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {reportBooking && (
        <ReportNoShow booking={reportBooking} onClose={() => { setReportBooking(null); fetchBookings(); }} />
      )}
    </div>
  );
}
