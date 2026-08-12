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
    <div className="row justify-content-center mt-5 animate-fade-in-up">
      <div className="col-md-5">
        <div className="auth-card">
          <div className="auth-header">
            <i className="bi bi-tools display-5"></i>
            <h3 className="mt-2 fw-bold">Welcome Back</h3>
            <p className="mb-0 opacity-75">Sign in to your FixIt account</p>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-modern alert-modern-danger d-flex align-items-center"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Login as</label>
                <div className="role-selector btn-group w-100" role="group">
                  <button type="button" className={`btn ${form.role === 'user' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, role: 'user' })}>
                    <i className="bi bi-person me-1"></i>User
                  </button>
                  <button type="button" className={`btn ${form.role === 'provider' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, role: 'provider' })}>
                    <i className="bi bi-person-badge me-1"></i>Provider
                  </button>
                  <button type="button" className={`btn ${form.role === 'admin' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, role: 'admin' })}>
                    <i className="bi bi-shield-lock me-1"></i>Admin
                  </button>
                  <button type="button" className={`btn ${form.role === 'subadmin' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, role: 'subadmin' })}>
                    <i className="bi bi-person-gear me-1"></i>Sub Admin
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input type="email" className="form-control form-modern" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input type="password" className="form-control form-modern" placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2">
                <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
              </button>
            </form>
            <p className="text-center mt-4 mb-0 text-muted">
              Don't have an account? <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: 'var(--primary)' }}>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
