import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function Favorites() {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    if (!token) return;
    axios.get(`${API}/favorites`)
      .then(res => setFavorites(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavorites(); }, [token]); // eslint-disable-line

  const toggleFav = async (pid) => {
    await axios.post(`${API}/favorites/toggle`, { providerId: pid });
    setFavorites(favorites.filter(f => f._id !== pid));
  };

  if (loading) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  return (
    <div className="animate-fade-in">
      <h3 className="fw-bold mb-4"><i className="bi bi-heart" style={{ color: 'var(--primary)' }}></i> My Favorites</h3>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-heartbreak"></i></div>
          <h5 className="fw-bold">No favorites yet</h5>
          <p className="text-muted">Save providers you like by tapping the heart icon.</p>
          <Link to="/services" className="btn btn-modern btn-modern-primary">Browse Services</Link>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((p, i) => (
            <div className="col-md-4 animate-fade-in-up" key={p._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="provider-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="provider-avatar me-3">{p.name?.charAt(0)}</div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-0">{p.name}</h5>
                      <span className="badge badge-modern badge-modern-primary">{p.profession}</span>
                    </div>
                    <button className="btn btn-sm p-1" onClick={() => toggleFav(p._id)}
                      title="Remove from favorites" style={{ color: '#ef4444' }}>
                      <i className="bi bi-heart-fill fs-5"></i>
                    </button>
                  </div>
                  <p className="text-muted small">{p.description}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded-3" style={{ background: 'var(--surface-2)' }}>
                    <span><i className="bi bi-star-fill text-warning"></i> <strong>{p.rating || '—'}</strong></span>
                    <span><i className="bi bi-briefcase" style={{ color: 'var(--primary)' }}></i> {p.experience} yrs</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="price-tag">${p.pricePerHour}<small>/hr</small></div>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/provider/${p._id}`} className="btn btn-modern btn-modern-outline flex-grow-1">
                      <i className="bi bi-eye me-1"></i>Profile
                    </Link>
                    {user?.role === 'user' && (
                      <Link to={`/book/${p._id}`} className="btn btn-modern btn-modern-primary flex-grow-1">
                        <i className="bi bi-calendar-plus me-1"></i>Book
                      </Link>
                    )}
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
