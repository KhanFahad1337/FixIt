import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import API from '../config';

export default function AiTools() {
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAI = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError('');
    setEstimate(null);
    setMatches(null);
    try {
      const [e, m] = await Promise.all([
        axios.post(`${API}/ai/estimate-price`, { description }),
        axios.post(`${API}/ai/match-providers`, { description }),
      ]);
      setEstimate(e.data);
      setMatches(m.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'I need a plumber to fix a leaking pipe for about 3 hours',
    'urgent electrician needed to repair faulty wiring',
    'AC technician to install a new air conditioner',
    'painter for interior walls of a 2-bedroom house',
  ];

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-4">
        <div className="p-3 rounded-3 me-3" style={{ background: 'var(--primary-light)' }}>
          <i className="bi bi-magic fs-4" style={{ color: 'var(--primary)' }}></i>
        </div>
        <div>
          <h2 className="fw-bold mb-1">AI Service Assistant</h2>
          <p className="text-muted mb-0">Describe your job — get a smart price estimate and matched providers</p>
        </div>
      </div>

      <div className="card-modern mb-4">
        <div className="card-body">
          <label className="fw-semibold mb-2 d-block">
            <i className="bi bi-chat-left-text me-1" style={{ color: 'var(--primary)' }}></i>Describe the job you need
          </label>
          <textarea
            className="form-control form-modern mb-3"
            rows="3"
            placeholder="e.g. I need an electrician to fix faulty wiring, about 2 hours, urgent"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="d-flex flex-wrap gap-2 mb-3">
            {suggestions.map((s, i) => (
              <button key={i} className="btn btn-sm btn-modern btn-modern-outline" onClick={() => setDescription(s)}>
                {s}
              </button>
            ))}
          </div>
          <button className="btn btn-modern btn-modern-primary" onClick={runAI} disabled={loading || !description.trim()}>
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>AI Analyzing...</span>
            ) : (
              <span><i className="bi bi-stars me-1"></i>Run AI Analysis</span>
            )}
          </button>
          {error && <div className="alert alert-danger mt-3 mb-0 py-2">{error}</div>}
        </div>
      </div>

      {estimate && (
        <div className="row g-4 mb-4">
          <div className="col-md-4 animate-fade-in-up">
            <div className="card-modern h-100">
              <div className="card-body">
                <h6 className="fw-bold mb-3"><i className="bi bi-cash-coin me-2" style={{ color: 'var(--primary)' }}></i>Smart Price Estimate</h6>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Service Type</small>
                  <span className="badge badge-modern-primary">{estimate.serviceType}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Estimated Hours</small>
                  <span className="fw-bold fs-5">{estimate.estimatedHours} hrs</span>
                </div>
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">Estimated Range</small>
                  <span className="fw-bold fs-4" style={{ color: 'var(--primary)' }}>
                    ${estimate.priceRange[0]} – ${estimate.priceRange[1]}
                  </span>
                </div>
                <small className="text-muted d-block mb-2">Base rate: ${estimate.baseRate}/hr</small>
                <div className="d-flex align-items-center">
                  <div className="progress flex-grow-1" style={{ height: 8 }}>
                    <div className="progress-bar" style={{ width: `${Math.round(estimate.confidence * 100)}%`, background: 'var(--primary)' }}></div>
                  </div>
                  <small className="ms-2 text-muted">{Math.round(estimate.confidence * 100)}% conf.</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-modern h-100">
              <div className="card-body">
                <h6 className="fw-bold mb-3"><i className="bi bi-person-check me-2" style={{ color: 'var(--primary)' }}></i>Smart Provider Matches</h6>
                {matches?.length === 0 ? (
                  <p className="text-muted mb-0">No providers available.</p>
                ) : (
                  <div className="row g-3">
                    {matches?.map((m, i) => (
                      <div className="col-md-6" key={m.provider._id}>
                        <div className="border rounded-3 p-3 h-100" style={{ borderColor: i === 0 ? 'var(--primary)' : 'var(--border)' }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="fw-bold">{m.provider.name}</div>
                              <small className="text-muted">{m.provider.profession} · ⭐{m.provider.rating || 'N/A'} · {m.provider.experience} yrs</small>
                            </div>
                            {i === 0 && <span className="badge badge-modern-primary">Best Match</span>}
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold" style={{ color: 'var(--primary)' }}>${m.provider.pricePerHour}/hr</span>
                            <span className="fw-bold" style={{ color: m.matchScore >= 70 ? '#22c55e' : m.matchScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                              {m.matchScore}%
                            </span>
                          </div>
                          <div className="progress mb-2" style={{ height: 6 }}>
                            <div className="progress-bar" style={{ width: `${m.matchScore}%`, background: m.matchScore >= 70 ? '#22c55e' : m.matchScore >= 50 ? '#f59e0b' : '#ef4444' }}></div>
                          </div>
                          <small className="text-muted d-block mb-2">{m.matchReason}</small>
                          <Link to={`/provider/${m.provider._id}`} className="btn btn-sm btn-modern btn-modern-secondary w-100">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
