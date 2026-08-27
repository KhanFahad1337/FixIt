import React from 'react';
import { Link } from 'react-router-dom';

const professions = [
  { name: 'Electrician', icon: 'bi-lightning-charge-fill', emoji: '⚡', desc: 'Electrical repairs, installation, wiring', color: '#f59e0b' },
  { name: 'Plumber', icon: 'bi-droplet-fill', emoji: '🔧', desc: 'Pipe repair, drainage, water heater', color: '#06b6d4' },
  { name: 'Painter', icon: 'bi-brush-fill', emoji: '🎨', desc: 'Interior & exterior painting', color: '#8b5cf6' },
  { name: 'AC Technician', icon: 'bi-snow2', emoji: '❄️', desc: 'AC repair, installation, servicing', color: '#0ea5e9' },
  { name: 'Carpenter', icon: 'bi-hammer', emoji: '🔨', desc: 'Furniture, cabinets, woodwork', color: '#d97706' },
  { name: 'Cleaner', icon: 'bi-stars', emoji: '🧹', desc: 'Home & office cleaning services', color: '#10b981' },
];

export default function Services() {
  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-5">
        <div className="section-icon me-3">
          <i className="bi bi-grid-3x3-gap-fill fs-5"></i>
        </div>
        <div>
          <h2 className="fw-bold mb-1">Service Categories</h2>
          <p className="text-muted mb-0">Choose a service to find available providers</p>
        </div>
      </div>

      <div className="row g-4">
        {professions.map((p, i) => (
          <div className="col-md-4 animate-fade-in-up" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <Link to={`/services/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-decoration-none">
              <div className="provider-card" style={{ cursor: 'pointer' }}>
                <div className="provider-header" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '3.5rem', lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>{p.emoji}</span>
                  </div>
                </div>
                <div className="card-body text-center py-4">
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>{p.name}</h5>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>{p.desc}</p>
                  <span className="btn btn-modern btn-modern-primary w-100">
                    <i className="bi bi-eye me-1"></i>View Providers
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
