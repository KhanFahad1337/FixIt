import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function ProviderEditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', profession: '', experience: '', pricePerHour: '', description: '',
  });
  const [original, setOriginal] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${API}/providers/${user._id}`).then(res => {
      const p = res.data;
      const data = {
        name: p.name || '', phone: p.phone || '', profession: p.profession || '',
        experience: p.experience?.toString() || '', pricePerHour: p.pricePerHour?.toString() || '',
        description: p.description || '',
      };
      setForm(data);
      setOriginal(data);
    }).catch(() => setError('Failed to load profile'))
    .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        experience: Number(form.experience),
        pricePerHour: Number(form.pricePerHour),
      };
      await axios.put(`${API}/providers/${user._id}`, data);
      setSaved(true);
      setOriginal(form);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

  if (loading) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  return (
    <div className="row justify-content-center animate-fade-in">
      <div className="col-md-6">
        <div className="auth-card">
          <div className="auth-header">
            <i className="bi bi-pencil-square display-5"></i>
            <h3 className="mt-2 fw-bold">Edit Profile</h3>
            <p className="mb-0 opacity-75">Update your professional information</p>
          </div>
          <div className="card-body p-4">
            {saved && <div className="alert alert-modern alert-modern-success"><i className="bi bi-check-circle me-2"></i>Profile updated successfully!</div>}
            {error && <div className="alert alert-modern alert-modern-danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input name="name" className="form-control form-modern" value={form.name}
                  onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input name="phone" className="form-control form-modern" value={form.phone}
                  onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Profession</label>
                <select name="profession" className="form-select form-modern" value={form.profession}
                  onChange={handleChange} required>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                  <option>AC Technician</option>
                  <option>Carpenter</option>
                  <option>Cleaner</option>
                </select>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Experience (years)</label>
                  <input name="experience" type="number" className="form-control form-modern" value={form.experience}
                    onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Price per Hour ($)</label>
                  <input name="pricePerHour" type="number" className="form-control form-modern" value={form.pricePerHour}
                    onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Description</label>
                <textarea name="description" className="form-control form-modern" rows="3" value={form.description}
                  onChange={handleChange} placeholder="Describe your expertise..."></textarea>
              </div>
              <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2" disabled={!hasChanges}>
                <i className="bi bi-check-lg me-1"></i>Save Changes
              </button>
              {!hasChanges && <p className="text-center text-muted small mt-2">No changes to save</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
