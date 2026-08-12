import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function Providers() {
  const { category } = useParams();
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('');

  const professionMap = {
    'electrician': 'Electrician', 'plumber': 'Plumber', 'painter': 'Painter',
    'ac-technician': 'AC Technician', 'carpenter': 'Carpenter', 'cleaner': 'Cleaner',
  };

  const professionName = professionMap[category] || category;

  useEffect(() => {
    axios.get(`${API}/providers?profession=${professionName}`)
      .then(res => setProviders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, professionName]);

  const maxPrice = useMemo(() => {
    if (providers.length === 0) return 200;
    return Math.max(200, ...providers.map(p => p.pricePerHour)) + 20;
  }, [providers]);

  const filtered = useMemo(() => {
    let list = providers.filter(p => p.pricePerHour >= priceRange[0] && p.pricePerHour <= priceRange[1]);
    if (sortBy === 'price-asc') list.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'experience') list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    return list;
  }, [providers, priceRange, sortBy]);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="loading-spinner mx-auto"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-4">
        <Link to="/services" className="btn btn-modern btn-modern-outline btn-sm me-3">
          <i className="bi bi-arrow-left me-1"></i>Back
        </Link>
        <div>
          <h2 className="fw-bold mb-1">{professionName} Providers</h2>
          <p className="text-muted mb-0">{filtered.length} of {providers.length} provider(s)</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-bar d-flex flex-wrap align-items-center gap-3 mb-4 p-3 rounded-3">
        <i className="bi bi-funnel" style={{ color: 'var(--primary)' }}></i>
        <span className="fw-semibold small">Price Range</span>
        <div className="d-flex align-items-center gap-2">
          <span className="price-label">${priceRange[0]}</span>
          <span className="text-muted small">to</span>
          <span className="price-label">${priceRange[1]}</span>
        </div>
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 200 }}>
          <input type="range" className="price-range flex-grow-1" min={0} max={maxPrice} value={priceRange[0]}
            onChange={e => setPriceRange([Math.min(+e.target.value, priceRange[1] - 5), priceRange[1]])} />
          <input type="range" className="price-range flex-grow-1" min={0} max={maxPrice} value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0] + 5)])} />
        </div>
        <div className="vr" style={{ height: 28 }}></div>
        <i className="bi bi-sort-down" style={{ color: 'var(--primary)' }}></i>
        <select className="form-select form-select-sm" style={{ width: 160, background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="experience">Most Experienced</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-people"></i></div>
          <h5 className="fw-bold">No providers match</h5>
          <p className="text-muted">Try adjusting the price range or clearing filters.</p>
          <button className="btn btn-modern btn-modern-primary" onClick={() => { setPriceRange([0, maxPrice]); setSortBy(''); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((p, i) => (
            <div className="col-md-4 animate-fade-in-up" key={p._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="provider-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="provider-avatar me-3">{p.name.charAt(0)}</div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-0">{p.name}</h5>
                      <span className="badge badge-modern badge-modern-primary">{p.profession}</span>
                    </div>
                  </div>
                  <p className="text-muted small">{p.description}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded-3" style={{ background: 'var(--surface-2)' }}>
                    <span><i className="bi bi-star-fill text-warning"></i> <strong>{p.rating || '—'}</strong></span>
                    <span><i className="bi bi-briefcase" style={{ color: 'var(--primary)' }}></i> {p.experience} yrs</span>
                    {p.isAvailable && <span className="badge badge-modern-success">Available</span>}
                    {!p.isAvailable && <span className="badge badge-modern-warning">Busy</span>}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="price-tag">${p.pricePerHour}<small>/hr</small></div>
                    {p.totalReviews > 0 && (
                      <small className="text-muted">{p.totalReviews} review(s)</small>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/provider/${p._id}`} className="btn btn-modern btn-modern-outline flex-grow-1">
                      <i className="bi bi-eye me-1"></i>Profile
                    </Link>
                    {user && user.role === 'user' ? (
                      <Link to={`/book/${p._id}`} className="btn btn-modern btn-modern-primary flex-grow-1">
                        <i className="bi bi-calendar-plus me-1"></i>Book
                      </Link>
                    ) : !user ? (
                      <Link to="/login" className="btn btn-modern btn-modern-outline flex-grow-1">
                        <i className="bi bi-box-arrow-in-right me-1"></i>Login
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
