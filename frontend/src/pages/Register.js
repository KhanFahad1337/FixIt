import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    role: searchParams.get('role') === 'provider' ? 'provider' : 'user',
    name: '', email: '', password: '', phone: '',
    address: '', profession: '', experience: '', pricePerHour: '', description: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name: form.name, email: form.email, password: form.password, phone: form.phone };
      if (form.role === 'provider') {
        data.profession = form.profession;
        data.experience = Number(form.experience);
        data.pricePerHour = Number(form.pricePerHour);
        data.description = form.description;
      } else {
        data.address = form.address;
      }
      await register(data, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="row justify-content-center align-items-center mt-3 mb-4 animate-fade-in" style={{ minHeight: '75vh' }}>
      <div className="col-lg-10">
        <div className="auth-card">
          <div className="row g-0">
            {/* Left Panel - Illustration */}
            <div className="col-lg-5 d-none d-lg-flex" style={{ background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(6,182,212,0.15) 0%, transparent 60%)' }}></div>
              <div style={{ position: 'absolute', top: '20%', left: '15%', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', animation: 'heroFloat 7s ease-in-out infinite' }}></div>
              <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'heroFloat 9s ease-in-out infinite reverse' }}></div>
              <div className="d-flex flex-column justify-content-center align-items-center p-5 text-white position-relative" style={{ zIndex: 1 }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <i className="bi bi-person-plus" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h3 className="fw-bold mb-2 text-center">Join FixIt</h3>
                <p className="text-center opacity-75 mb-4" style={{ maxWidth: 260, lineHeight: 1.6 }}>Create your account and start booking trusted professionals today</p>
                <div className="d-flex gap-3">
                  {['bi-shield-check', 'bi-clock', 'bi-chat-dots'].map((icon, i) => (
                    <div key={i} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <i className={`bi ${icon}`}></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="col-lg-7">
              <div className="card-body p-5">
                <div className="text-center mb-4 d-lg-none">
                  <i className="bi bi-person-plus display-4 gradient-text"></i>
                </div>
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="text-muted mb-4">Fill in your details to get started</p>

                {error && (
                  <div className="alert alert-modern alert-modern-danger d-flex align-items-center animate-fade-in">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Register as</label>
                    <div className="role-selector btn-group w-100" role="group">
                      <button type="button" className={`btn ${form.role === 'user' ? 'active' : ''}`}
                        onClick={() => updateForm('role', 'user')}>
                        <i className="bi bi-person me-1"></i>User
                      </button>
                      <button type="button" className={`btn ${form.role === 'provider' ? 'active' : ''}`}
                        onClick={() => updateForm('role', 'provider')}>
                        <i className="bi bi-person-badge me-1"></i>Service Provider
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                        <input type="text" className="form-control form-modern" style={{ paddingLeft: 38 }} placeholder="John Doe"
                          value={form.name} onChange={e => updateForm('name', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                        <input type="email" className="form-control form-modern" style={{ paddingLeft: 38 }} placeholder="you@example.com"
                          value={form.email} onChange={e => updateForm('email', e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                        <input type="password" className="form-control form-modern" style={{ paddingLeft: 38 }} placeholder="Create password"
                          value={form.password} onChange={e => updateForm('password', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Phone</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-telephone" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                        <input type="text" className="form-control form-modern" style={{ paddingLeft: 38 }} placeholder="+1234567890"
                          value={form.phone} onChange={e => updateForm('phone', e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  {form.role === 'user' ? (
                    <div className="mb-4">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Address</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-geo-alt" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                        <input type="text" className="form-control form-modern" style={{ paddingLeft: 38 }} placeholder="123 Main St"
                          value={form.address} onChange={e => updateForm('address', e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Profession</label>
                          <select className="form-select form-modern" value={form.profession}
                            onChange={e => updateForm('profession', e.target.value)} required>
                            <option value="">Select...</option>
                            <option>Electrician</option>
                            <option>Plumber</option>
                            <option>Painter</option>
                            <option>AC Technician</option>
                            <option>Carpenter</option>
                            <option>Cleaner</option>
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Experience (yrs)</label>
                          <input type="number" className="form-control form-modern" placeholder="5"
                            value={form.experience} onChange={e => updateForm('experience', e.target.value)} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Price / Hour ($)</label>
                          <input type="number" className="form-control form-modern" placeholder="40"
                            value={form.pricePerHour} onChange={e => updateForm('pricePerHour', e.target.value)} required />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Description</label>
                        <textarea className="form-control form-modern" rows="2" placeholder="Tell us about your expertise"
                          value={form.description} onChange={e => updateForm('description', e.target.value)}></textarea>
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2.5" style={{ fontSize: '0.95rem' }}>
                    <i className="bi bi-person-plus me-2"></i>Create Account
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none gradient-text">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
