import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center align-items-center mt-4 mb-5 animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="col-lg-10">
        <div className="auth-card">
          <div className="row g-0">
            {/* Left Panel - Illustration */}
            <div className="col-lg-5 d-none d-lg-flex" style={{ background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 40%, rgba(124,58,237,0.2) 0%, transparent 60%)' }}></div>
              <div style={{ position: 'absolute', top: '10%', left: '10%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'heroFloat 6s ease-in-out infinite' }}></div>
              <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', animation: 'heroFloat 8s ease-in-out infinite reverse' }}></div>
              <div className="d-flex flex-column justify-content-center align-items-center p-5 text-white position-relative" style={{ zIndex: 1 }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <i className="bi bi-tools" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h3 className="fw-bold mb-2 text-center">Welcome Back</h3>
                <p className="text-center opacity-75 mb-4" style={{ maxWidth: 260, lineHeight: 1.6 }}>Sign in to access your dashboard and manage your services</p>
                <div className="d-flex gap-4">
                  <div className="text-center">
                    <div className="fw-bold fs-4">31+</div>
                    <small className="opacity-75">Pros</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4">500+</div>
                    <small className="opacity-75">Jobs Done</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4">4.8</div>
                    <small className="opacity-75">Rating</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="col-lg-7">
              <div className="card-body p-5">
                <div className="text-center mb-4 d-lg-none">
                  <i className="bi bi-tools display-4 gradient-text"></i>
                </div>
                <h3 className="fw-bold mb-1">Sign In</h3>
                <p className="text-muted mb-4">Enter your credentials to continue</p>

                {error && (
                  <div className="alert alert-modern alert-modern-danger d-flex align-items-center animate-fade-in">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Login as</label>
                    <div className="role-selector btn-group w-100" role="group">
                      {[
                        { role: 'user', icon: 'bi-person', label: 'User' },
                        { role: 'provider', icon: 'bi-person-badge', label: 'Provider' },
                        { role: 'admin', icon: 'bi-shield-lock', label: 'Admin' },
                        { role: 'subadmin', icon: 'bi-person-gear', label: 'Sub Admin' },
                      ].map(r => (
                        <button key={r.role} type="button"
                          className={`btn ${form.role === r.role ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, role: r.role })}>
                          <i className={`bi ${r.icon} me-1`}></i>{r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                      <input type="email" className="form-control form-modern" style={{ paddingLeft: 38 }}
                        placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                      <input type="password" className="form-control form-modern" style={{ paddingLeft: 38 }}
                        placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2.5" style={{ fontSize: '0.95rem' }}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="fw-semibold text-decoration-none gradient-text">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
