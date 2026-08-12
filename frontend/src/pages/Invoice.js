import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API from '../config';

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`).then(res => setBooking(res.data)).catch(() => {});
    axios.get(`${API}/payments/${id}`).then(res => setPayment(res.data)).catch(() => {});
  }, [id]);

  const handlePrint = () => window.print();

  if (!booking) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  const statusSteps = [
    { label: 'Pending', value: 'pending', icon: 'bi-clock' },
    { label: 'Confirmed', value: 'confirmed', icon: 'bi-check2' },
    { label: 'In Progress', value: 'in_progress', icon: 'bi-arrow-repeat' },
    { label: 'Completed', value: 'completed', icon: 'bi-check2-all' },
  ];
  const currentStep = statusSteps.findIndex(s => s.value === booking.status);

  return (
    <div className="row justify-content-center animate-fade-in">
      <div className="col-md-7">
        <div className="card-modern p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">
                <i className="bi bi-receipt me-2" style={{ color: 'var(--primary)' }}></i>
                Invoice
              </h3>
              <small className="text-muted">#{booking._id?.slice(-8).toUpperCase()}</small>
            </div>
            <button className="btn btn-modern btn-modern-outline" onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i>Print
            </button>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold mb-3">Booking Status</h6>
            <div className="d-flex justify-content-between position-relative">
              {statusSteps.map((s, i) => (
                <div key={s.value} className="text-center" style={{ flex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: i <= currentStep ? 'var(--primary)' : 'var(--surface-2)',
                    color: i <= currentStep ? 'var(--text-white)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 6px', fontSize: 16,
                  }}>
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <small className="d-block" style={{ fontSize: 11, color: i <= currentStep ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i <= currentStep ? 600 : 400 }}>
                    {s.label}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="card-modern p-3 mb-3">
            <div className="row">
              <div className="col-6 mb-2">
                <small className="text-muted d-block">Provider</small>
                <span className="fw-semibold">{booking.provider?.name}</span>
              </div>
              <div className="col-6 mb-2">
                <small className="text-muted d-block">Service Date</small>
                <span className="fw-semibold">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">Address</small>
                <span className="fw-semibold">{booking.address}</span>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">Hours</small>
                <span className="fw-semibold">{booking.hours} hr(s)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-3 mb-3" style={{ background: 'var(--surface-2)' }}>
            <div className="d-flex justify-content-between mb-1">
              <span>Service Fee ({booking.hours} hrs × ${booking.provider?.pricePerHour}/hr)</span>
              <span>${booking.totalAmount?.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold" style={{ color: 'var(--primary)', fontSize: 18 }}>
              <span>Total</span>
              <span>${booking.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {payment && (
            <div className="d-flex justify-content-between p-2 bg-light rounded-3">
              <span className="text-muted">Payment</span>
              <span className="fw-semibold">
                {payment.status === 'completed' ? (
                  <span className="text-success"><i className="bi bi-check-circle me-1"></i>Paid via {payment.method}</span>
                ) : (
                  <span className="text-warning"><i className="bi bi-hourglass me-1"></i>Pending</span>
                )}
              </span>
            </div>
          )}
        </div>
        <button className="btn btn-modern btn-modern-outline w-100" onClick={() => navigate('/my-bookings')}>
          <i className="bi bi-arrow-left me-1"></i>Back to Bookings
        </button>
      </div>
    </div>
  );
}
