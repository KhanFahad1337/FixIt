import React, { useState } from 'react';
import axios from 'axios';

import API from '../config';

export default function ReportNoShow({ booking, onClose }) {
  const [action, setAction] = useState('refund');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/noshow`, {
        bookingId: booking._id,
        action,
        description,
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
    }} onClick={onClose}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: 480, width: '90%', borderRadius: 16 }}
        onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="card-body text-center p-5">
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e6f9f4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-check-circle text-success fs-2"></i>
            </div>
            <h5 className="fw-bold">Report Submitted</h5>
            <p className="text-muted mb-3">Your report has been filed. Admin will review it shortly.</p>
            <p className="text-muted small mb-3">
              {action === 'refund' ? 'A refund will be processed if approved.' : 'We\'ll help you book another provider.'}
            </p>
            <button className="btn btn-modern btn-modern-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #e17055, #fd79a8)', borderRadius: '16px 16px 0 0' }}>
              <i className="bi bi-exclamation-triangle display-5"></i>
              <h4 className="fw-bold mt-2">Report No-Show</h4>
              <p className="mb-0 opacity-75">Provider didn't arrive?</p>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="card-modern p-3 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Booking</span>
                  <span className="fw-semibold">{new Date(booking.date).toLocaleDateString()} {booking.time}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Amount</span>
                  <span className="fw-bold" style={{ color: 'var(--primary)' }}>${booking.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">What would you like?</label>
                  <div className="d-flex gap-2">
                    <button type="button" className={`btn flex-grow-1 ${action === 'refund' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setAction('refund')}>
                      <i className="bi bi-currency-dollar me-1"></i>Refund
                    </button>
                    <button type="button" className={`btn flex-grow-1 ${action === 'rebook' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setAction('rebook')}>
                      <i className="bi bi-calendar-plus me-1"></i>Rebook
                    </button>
                    <button type="button" className={`btn flex-grow-1 ${action === 'both' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setAction('both')}>
                      <i className="bi bi-arrow-repeat me-1"></i>Both
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description (optional)</label>
                  <textarea className="form-control form-modern" rows="2" placeholder="Tell us what happened..."
                    value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-1"></span>Submitting...</>
                  ) : (
                    <><i className="bi bi-send me-1"></i>Submit Report</>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
