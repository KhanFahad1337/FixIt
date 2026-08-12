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

  return (
    <div className="row justify-content-center mt-4 mb-4 animate-fade-in-up">
      <div className="col-md-6">
        <div className="auth-card">
          <div className="auth-header">
            <i className="bi bi-person-plus display-5"></i>
            <h3 className="mt-2 fw-bold">Create Account</h3>
            <p className="mb-0 opacity-75">Join FixIt today</p>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-modern alert-modern-danger d-flex align-items-center"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Register as</label>
                <div className="role-selector btn-group w-100" role="group">
                  <button type="button" className={`btn ${form.role === 'user' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ role: 'user', name: '', email: '', password: '', phone: '', address: '', profession: '', experience: '', pricePerHour: '', description: '' })}>
                    <i className="bi bi-person me-1"></i>User
                  </button>
                  <button type="button" className={`btn ${form.role === 'provider' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ role: 'provider', name: '', email: '', password: '', phone: '', address: '', profession: '', experience: '', pricePerHour: '', description: '' })}>
                    <i className="bi bi-person-badge me-1"></i>Service Provider
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input type="text" className="form-control form-modern" placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control form-modern" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control form-modern" placeholder="Create password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input type="text" className="form-control form-modern" placeholder="+1234567890"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              {form.role === 'user' ? (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <input type="text" className="form-control form-modern" placeholder="123 Main St"
                    value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Profession</label>
                      <select className="form-select form-modern" value={form.profession}
                        onChange={e => setForm({ ...form, profession: e.target.value })} required>
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
                      <label className="form-label fw-semibold">Experience (years)</label>
                      <input type="number" className="form-control form-modern" placeholder="5"
                        value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Price / Hour ($)</label>
                      <input type="number" className="form-control form-modern" placeholder="40"
                        value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control form-modern" rows="2" placeholder="Tell us about your expertise"
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2">
                <i className="bi bi-person-plus me-1"></i>Create Account
              </button>
            </form>
            <p className="text-center mt-4 mb-0 text-muted">
              Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--primary)' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
