import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function Profile() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [stats, setStats] = useState({ totalBookings: 0, completed: 0, totalSpent: 0 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
      axios.get(`${API}/bookings/my`).then(res => {
        const b = res.data;
        setStats({
          totalBookings: b.length,
          completed: b.filter(x => x.status === 'completed').length,
          totalSpent: b.filter(x => x.paymentStatus === 'paid').reduce((s, x) => s + (x.totalAmount || 0), 0),
        });
      }).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/auth/profile`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="row g-4 animate-fade-in" style={{ maxWidth: 950, margin: '0 auto' }}>
      {/* Left Card - Profile Info */}
      <div className="col-md-4">
        <div style={{
          background: 'var(--gradient-1)',
          borderRadius: 20,
          padding: '2.5rem 1.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Decorative waves */}
          <svg style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, opacity: 0.15 }} viewBox="0 0 200 200">
            <path d="M0,100 Q50,20 100,100 T200,100 V0 H0 Z" fill="white"/>
          </svg>
          <svg style={{ position: 'absolute', bottom: 40, right: -30, width: 100, height: 100, opacity: 0.1 }} viewBox="0 0 200 200">
            <path d="M0,100 Q50,20 100,100 T200,100 V0 H0 Z" fill="white"/>
          </svg>

          {/* Avatar */}
          <div style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            fontWeight: 700,
            color: 'white',
            margin: '0 auto 1rem',
            backdropFilter: 'blur(8px)',
          }}>
            {user.name?.charAt(0) || 'U'}
          </div>

          {/* Name & Email */}
          <div className="text-center mb-3">
            <h4 className="fw-bold text-white mb-1">{user.name}</h4>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>{user.email}</p>
            <span style={{
              display: 'inline-block',
              background: 'white',
              color: '#008080',
              padding: '4px 16px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              {user.role}
            </span>
          </div>

          {/* Stats */}
          <div style={{ flex: 1 }}>
            <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                <i className="bi bi-calendar-check"></i> Total Bookings
              </span>
              <span className="fw-bold text-white">{stats.totalBookings}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                <i className="bi bi-check-circle"></i> Completed
              </span>
              <span className="fw-bold text-white">{stats.completed}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                <i className="bi bi-wallet2"></i> Total Spent
              </span>
              <span className="fw-bold text-white">${stats.totalSpent.toFixed(2)}</span>
            </div>
          </div>

          {/* Trust text */}
          <div className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.8rem' }}>
            <i className="bi bi-shield-check me-1"></i>
            Your trust<br />is our priority
          </div>
        </div>
      </div>

      {/* Right Card - Edit Profile */}
      <div className="col-md-8">
        <div className="card-modern" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', height: '100%' }}>
          {/* Decorative corner */}
          <svg style={{ position: 'absolute', top: -10, right: -10, width: 100, height: 100, opacity: 0.08 }} viewBox="0 0 200 200">
            <path d="M0,100 Q50,20 100,100 T200,100 V0 H0 Z" fill="var(--primary)"/>
          </svg>

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-1">
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className="bi bi-pencil-square text-white"></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0">Edit Profile</h4>
              <small className="text-muted">Keep your information up to date</small>
            </div>
          </div>

          <hr className="my-3" />

          {/* Form */}
          {saved && (
            <div className="alert" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
              <i className="bi bi-check-circle me-2"></i>Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-person" style={{ color: 'var(--primary)' }}></i> Full Name
              </label>
              <input
                className="form-control form-modern"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-telephone" style={{ color: 'var(--primary)' }}></i> Phone
              </label>
              <input
                className="form-control form-modern"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-geo-alt" style={{ color: 'var(--primary)' }}></i> Address
              </label>
              <input
                className="form-control form-modern"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2.5 fw-semibold"
              style={{
                background: 'var(--gradient-1)',
                color: 'white',
                borderRadius: 12,
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(0,128,128,0.3)',
                border: 'none',
              }}
            >
              <i className="bi bi-check-lg me-1"></i> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
