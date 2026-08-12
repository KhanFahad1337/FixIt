import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API from '../config';

export default function Booking() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', address: '', description: '', hours: 1 });
  const [error, setError] = useState('');
  const [aiSlots, setAiSlots] = useState(null);
  const [slotLoading, setSlotLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/providers/${providerId}`)
      .then(res => setProvider(res.data))
      .catch(() => setError('Provider not found'));
  }, [providerId]);

  const getAiTimes = async () => {
    if (!form.date) return;
    setSlotLoading(true);
    setAiSlots(null);
    try {
      const res = await axios.post(`${API}/ai/suggest-times`, { providerId, date: form.date });
      setAiSlots(res.data);
      if (res.data.slots?.length && !form.time) setForm(f => ({ ...f, time: res.data.slots[0] }));
    } catch {
      setError('Failed to load AI time suggestions');
    } finally {
      setSlotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/bookings`, {
        provider: providerId, service: providerId,
        date: form.date, time: form.time, address: form.address,
        description: form.description, hours: form.hours,
      });
      navigate(`/payment/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!provider) return (
    <div className="text-center mt-5">
      <div className="loading-spinner mx-auto"></div>
    </div>
  );

  return (
    <div className="row justify-content-center mt-4 animate-fade-in-up">
      <div className="col-md-6">
        <div className="auth-card">
          <div className="auth-header">
            <i className="bi bi-calendar-check display-5"></i>
            <h3 className="mt-2 fw-bold">Book a Service</h3>
            <p className="mb-0 opacity-75">Schedule your appointment</p>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-modern alert-modern-danger d-flex align-items-center"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            <div className="card-modern p-3 mb-4 d-flex align-items-center">
              <div className="provider-avatar me-3">{provider.name.charAt(0)}</div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0">{provider.name}</h6>
                <small className="text-muted">{provider.profession} · ${provider.pricePerHour}/hr</small>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ color: 'var(--primary)' }}>${(provider.pricePerHour * form.hours).toFixed(2)}</div>
                <small className="text-muted">total</small>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input type="date" className="form-control form-modern" value={form.date}
                    onChange={e => { setForm({ ...form, date: e.target.value, time: '' }); setAiSlots(null); }} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Time</label>
                  <input type="time" className="form-control form-modern" value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <label className="form-label fw-semibold mb-0"><i className="bi bi-stars me-1" style={{ color: 'var(--primary)' }}></i>AI Time Suggestions</label>
                  <button type="button" className="btn btn-sm btn-modern btn-modern-secondary" onClick={getAiTimes} disabled={slotLoading || !form.date}>
                    {slotLoading ? 'Analyzing...' : 'Suggest best times'}
                  </button>
                </div>
                {slotLoading && <div className="text-muted small"><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2, display: 'inline-block', marginRight: 6 }}></div>Finding available slots...</div>}
                {aiSlots && (
                  <div className="p-3 rounded-3" style={{ background: 'var(--surface)' }}>
                    {aiSlots.slots.length === 0 ? (
                      <div className="text-muted small mb-0">
                        <i className="bi bi-exclamation-circle me-1"></i>{aiSlots.recommendation}
                      </div>
                    ) : (
                      <>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {aiSlots.slots.map(s => (
                            <button key={s} type="button"
                              className={`btn btn-sm ${form.time === s ? 'btn-modern btn-modern-primary' : 'btn-modern btn-modern-outline'}`}
                              onClick={() => setForm(f => ({ ...f, time: s }))}>
                              {s}
                            </button>
                          ))}
                        </div>
                        <small className="text-muted">{aiSlots.recommendation} {aiSlots.totalBookings > 0 && `(${aiSlots.totalBookings} booking(s) that day)`}</small>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Address</label>
                <input type="text" className="form-control form-modern" placeholder="Your address"
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control form-modern" rows="2" placeholder="Describe the job..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Estimated Hours</label>
                <input type="number" className="form-control form-modern" min="0.5" step="0.5"
                  value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} required />
              </div>
              <div className="p-3 rounded-3 mb-3 text-white text-center bg-primary">
                <h4 className="fw-bold mb-0">Total: ${(provider.pricePerHour * form.hours).toFixed(2)}</h4>
              </div>
              <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2">
                <i className="bi bi-arrow-right me-1"></i>Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
