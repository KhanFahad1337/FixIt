import React from 'react';
import { Link } from 'react-router-dom';

const professions = [
  { name: 'Electrician', emoji: '⚡', desc: 'Electrical repairs, installation, wiring' },
  { name: 'Plumber', emoji: '🔧', desc: 'Pipe repair, drainage, water heater' },
  { name: 'Painter', emoji: '🎨', desc: 'Interior & exterior painting' },
  { name: 'AC Technician', emoji: '❄️', desc: 'AC repair, installation, servicing' },
  { name: 'Carpenter', emoji: '🔨', desc: 'Furniture, cabinets, woodwork' },
  { name: 'Cleaner', emoji: '🧹', desc: 'Home & office cleaning services' },
];

export default function Services() {
  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-4">
        <div className="p-3 rounded-3 me-3" style={{ background: 'var(--primary-light)' }}>
          <i className="bi bi-grid fs-4" style={{ color: 'var(--primary)' }}></i>
        </div>
        <div>
          <h2 className="fw-bold mb-1">Service Categories</h2>
          <p className="text-muted mb-0">Choose a service to find available providers</p>
        </div>
      </div>

      <div className="row g-4">
        {professions.map((p, i) => (
          <div className="col-md-4 animate-fade-in-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <Link to={`/services/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-decoration-none">
              <div className="provider-card">
                  <div className="provider-header">
                  <span style={{ fontSize: '3.5rem', lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{p.emoji}</span>
                </div>
                <div className="card-body text-center">
                  <h5 className="fw-bold mb-2 text-dark">{p.name}</h5>
                  <p className="text-muted small mb-3">{p.desc}</p>
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
