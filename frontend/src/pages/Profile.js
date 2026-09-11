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
          background: 'linear-gradient(160deg, #004d4d 0%, #007070 30%, #008080 60%, #00a8a8 100%)',
          borderRadius: 20,
          padding: '2rem 1.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Decorative wave top-right */}
          <svg style={{ position: 'absolute', top: -15, right: -15, width: 110, height: 110, opacity: 0.2 }} viewBox="0 0 200 200">
            <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="white"/>
          </svg>
          {/* Decorative wave bottom-right */}
          <svg style={{ position: 'absolute', bottom: 20, right: -20, width: 90, height: 90, opacity: 0.12 }} viewBox="0 0 200 200">
            <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="white"/>
          </svg>

          {/* Avatar */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
            margin: '0 auto 0.8rem',
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          {/* Name & Email */}
          <div className="text-center mb-2">
            <h4 className="fw-bold text-white mb-1" style={{ fontSize: '1.15rem' }}>{user.name}</h4>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{user.email}</p>
            <span style={{
              display: 'inline-block',
              background: 'white',
              color: '#008080',
              padding: '3px 14px',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 600,
            }}>
              {user.role}
            </span>
          </div>

          {/* Stats */}
          <div style={{ flex: 1, marginTop: '1rem' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                <i className="bi bi-calendar3"></i> Total Bookings
              </span>
              <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>{stats.totalBookings}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                <i className="bi bi-check2-circle"></i> Completed
              </span>
              <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>{stats.completed}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0' }}>
              <span className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                <i className="bi bi-wallet2"></i> Total Spent
              </span>
              <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>${stats.totalSpent.toFixed(2)}</span>
            </div>
          </div>

          {/* Trust text */}
          <div className="d-flex align-items-center justify-content-center gap-2 mt-3" style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', fontSize: '0.78rem' }}>
            <i className="bi bi-shield-check"></i>
            <span>Your trust<br/>is our priority</span>
          </div>
        </div>
      </div>

      {/* Right Card - Edit Profile */}
      <div className="col-md-8">
        <div className="card-modern" style={{ padding: '2rem 2.5rem', position: 'relative', overflow: 'hidden', height: '100%' }}>
          {/* Decorative waves top-right */}
          <svg style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, opacity: 0.07 }} viewBox="0 0 200 200">
            <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="var(--primary)"/>
          </svg>
          <svg style={{ position: 'absolute', top: 30, right: 10, width: 60, height: 60, opacity: 0.05 }} viewBox="0 0 200 200">
            <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="var(--primary)"/>
          </svg>

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-1">
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <i className="bi bi-pencil-square text-white" style={{ fontSize: '1.1rem' }}></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0">Edit Profile</h4>
              <small className="text-muted">Keep your information up to date</small>
            </div>
          </div>

          <hr className="my-3" />

          {/* Form */}
          {saved && (
            <div className="alert" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.85rem' }}>
              <i className="bi bi-check-circle me-2"></i>Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-person" style={{ color: 'var(--primary)' }}></i> Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                <input
                  className="form-control form-modern"
                  style={{ paddingLeft: 38 }}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-telephone" style={{ color: 'var(--primary)' }}></i> Phone
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-telephone" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                <input
                  className="form-control form-modern"
                  style={{ paddingLeft: 38 }}
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="d-flex align-items-center gap-2 fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-geo-alt" style={{ color: 'var(--primary)' }}></i> Address
              </label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-geo-alt" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                <input
                  className="form-control form-modern"
                  style={{ paddingLeft: 38 }}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
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
