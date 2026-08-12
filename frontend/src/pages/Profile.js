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
    <div className="row g-4 animate-fade-in">
      <div className="col-md-4">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <h4 className="fw-bold mb-1">{user.name}</h4>
            <p className="mb-0 opacity-75">{user.email}</p>
            <span className="badge bg-white bg-opacity-25 text-white mt-2">{user.role}</span>
          </div>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Bookings</span>
              <span className="fw-bold" style={{ color: 'var(--text)' }}>{stats.totalBookings}</span>
            </div>
            <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
              <span className="fw-bold" style={{ color: 'var(--success)' }}>{stats.completed}</span>
            </div>
            <div className="d-flex justify-content-between p-2 rounded-3" style={{ background: 'var(--surface-2)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Spent</span>
              <span className="fw-bold" style={{ color: 'var(--primary)' }}>${stats.totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="auth-card">
          <div className="auth-header">
            <i className="bi bi-pencil-square display-5"></i>
            <h4 className="mt-2 fw-bold">Edit Profile</h4>
          </div>
          <div className="card-body p-4">
            {saved && <div className="alert alert-modern alert-modern-success"><i className="bi bi-check-circle me-2"></i>Profile updated!</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input className="form-control form-modern" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input className="form-control form-modern" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Address</label>
                <input className="form-control form-modern" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <button className="btn btn-modern btn-modern-primary w-100 py-2">
                <i className="bi bi-check-lg me-1"></i>Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
