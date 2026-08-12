import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import API from '../config';
import useCountUp from '../hooks/useCountUp';
import ScrollReveal from '../components/ScrollReveal';
import { StatCardSkeleton, CategoryCardSkeleton, ProviderCardSkeleton } from '../components/Skeleton';

const professions = [
  { name: 'Electrician', icon: 'bi-lightning-charge-fill', desc: 'Wiring, repairs, installations & more' },
  { name: 'Plumber', icon: 'bi-droplet-fill', desc: 'Pipes, drainage, water heaters' },
  { name: 'Painter', icon: 'bi-brush-fill', desc: 'Interior & exterior painting' },
  { name: 'AC Technician', icon: 'bi-snow2', desc: 'Repair, installation, servicing' },
  { name: 'Carpenter', icon: 'bi-hammer', desc: 'Furniture, cabinets, woodwork' },
  { name: 'Cleaner', icon: 'bi-star-fill', desc: 'Home & office cleaning' },
];

const features = [
  { icon: 'bi-shield-check', title: 'Verified Professionals', desc: 'Every provider is background-checked and approved by our team.' },
  { icon: 'bi-clock', title: 'Flexible Scheduling', desc: 'Book at your convenience with real-time availability.' },
  { icon: 'bi-currency-dollar', title: 'Transparent Pricing', desc: 'Know the cost upfront — no hidden fees or surprises.' },
  { icon: 'bi-chat-dots', title: '24/7 Support', desc: 'Our chatbot and support team are here whenever you need help.' },
  { icon: 'bi-shield-lock', title: 'Secure Payments', desc: 'Pay safely through our platform with multiple payment options.' },
  { icon: 'bi-arrow-repeat', title: 'Satisfaction Guaranteed', desc: 'Not happy? We\'ll make it right with our no-show protection.' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Homeowner', text: 'Found an amazing plumber through FixIt. Fixed my leak in under an hour!', rating: 5 },
  { name: 'James K.', role: 'Business Owner', text: 'Reliable service every time. The booking system is so easy to use.', rating: 5 },
  { name: 'Emily R.', role: 'Parent', text: 'Love the verified professionals. I feel safe hiring through this platform.', rating: 4 },
];

function AnimatedStat({ value, suffix, label, gradient, format }) {
  const [count, ref] = useCountUp(value, 2000);
  const display = format ? format(count) : count + (suffix || '');
  return (
    <div className="col-md-3" ref={ref}>
      <div className={`stat-card ${gradient || ''}`} style={!gradient ? { background: 'var(--warning)', color: 'var(--text-white)' } : {}}>
        <i className={`bi ${label === 'Verified Pros' ? 'bi-people-fill' : label === 'Jobs Completed' ? 'bi-check-circle-fill' : label === 'Avg Rating' ? 'bi-star-fill' : 'bi-emoji-smile'} stat-icon`}></i>
        <h2 className="fw-bold mb-1">{display}</h2>
        <p className="mb-0 opacity-80">{label}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProviders: 0 });
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    axios.get(`${API}/providers`).then(res => {
      setStats(prev => ({ ...prev, totalProviders: res.data.length }));
      setTopProviders(res.data.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const renderStars = (n) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<i key={i} className={`bi ${i <= n ? 'bi-star-fill' : 'bi-star'} text-warning me-1`} style={{ fontSize: 12 }}></i>);
    }
    return stars;
  };

  return (
    <div>
      {/* HERO */}
      <div className="hero-section rounded-4 mb-5 text-white animate-fade-in overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-7 p-5">
            <span className="badge px-3 py-2 rounded-pill mb-3 fs-6" style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--text-white)' }}>
              <i className="bi bi-star-fill me-1"></i> Trusted by 10,000+ Customers
            </span>
            <h1 className="display-4 fw-bold mb-3 lh-1">
              Your Home, <br />
              <span style={{ color: '#fbbf24' }}>Our Experts</span>
            </h1>
            <p className="fs-5 mb-4 opacity-90" style={{ maxWidth: 520 }}>
              Connect with verified professionals for all your home services — from electrical repairs to deep cleaning, we've got you covered.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/services" className="btn btn-light btn-lg fw-semibold px-4 rounded-3 shadow-sm">
                <i className="bi bi-search me-2"></i>Find a Service
              </Link>
              <Link to="/register?role=provider" className="btn btn-outline-light btn-lg fw-semibold px-4 rounded-3">
                <i className="bi bi-person-plus me-2"></i>Join as Pro
              </Link>
            </div>
            <div className="d-flex align-items-center gap-4 mt-4">
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex">
                  {[1,2,3,4,5].map(i => <i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: 14 }}></i>)}
                </div>
                <small className="opacity-75">4.8 average rating</small>
              </div>
              <small className="opacity-75"><i className="bi bi-people me-1"></i>{stats.totalProviders || 0}+ pros</small>
            </div>
          </div>
          <div className="col-lg-5 text-center p-4 d-none d-lg-block">
            <div className="display-1 opacity-75">
              <i className="bi bi-tools"></i>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-4 mb-5">
        {loading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <AnimatedStat value={stats.totalProviders} suffix="+" label="Verified Pros" gradient="card-gradient" />
            <AnimatedStat value={500} suffix="+" label="Jobs Completed" gradient="card-gradient-2" />
            <AnimatedStat value={48} suffix="" label="Avg Rating" format={v => (v / 10).toFixed(1)} />
            <AnimatedStat value={98} suffix="%" label="Satisfaction" gradient="card-gradient-3" />
          </>
        )}
      </div>

      {/* SERVICE CATEGORIES */}
      <ScrollReveal>
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="fw-bold mb-0">
              <span className="p-2 rounded-3 me-2" style={{ background: 'var(--primary-light)' }}>
                <i className="bi bi-grid" style={{ color: 'var(--primary)' }}></i>
              </span>
              Service Categories
            </h3>
            <Link to="/services" className="btn btn-modern btn-modern-outline btn-sm">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {professions.map((p, i) => (
              <div className="col-md-4 col-lg-2 mb-3" key={i}>
                <Link to={`/services/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-decoration-none">
                  <div className="category-card">
                    <div className="icon-wrap text-primary">
                      <i className={`bi ${p.icon}`}></i>
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>{p.name}</h6>
                    <small style={{ color: 'var(--text-secondary)' }}>{p.desc}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* TOP PROVIDERS */}
      <ScrollReveal>
        {loading ? (
          <div className="mb-5"><h3 className="fw-bold mb-4"><span className="p-2 rounded-3 me-2" style={{ background: 'var(--primary-light)' }}><i className="bi bi-trophy" style={{ color: 'var(--primary)' }}></i></span>Top Rated Professionals</h3><div className="row g-4"><ProviderCardSkeleton /><ProviderCardSkeleton /><ProviderCardSkeleton /><ProviderCardSkeleton /></div></div>
        ) : topProviders.length > 0 && (
          <div className="mb-5">
            <h3 className="fw-bold mb-4">
              <span className="p-2 rounded-3 me-2" style={{ background: 'var(--primary-light)' }}>
                <i className="bi bi-trophy" style={{ color: 'var(--primary)' }}></i>
              </span>
              Top Rated Professionals
            </h3>
            <div className="row g-4">
              {topProviders.map(p => (
                <div className="col-md-3" key={p._id}>
                  <Link to={`/provider/${p._id}`} className="text-decoration-none">
                    <div className="provider-card">
                      <div className="provider-header" style={{ padding: '1rem' }}>
                        <div className="provider-avatar mx-auto" style={{ width: 48, height: 48, fontSize: 18 }}>
                          {p.name?.charAt(0)}
                        </div>
                        <h6 className="fw-bold mt-2 mb-0 text-white">{p.name}</h6>
                        <small className="opacity-75">{p.profession}</small>
                      </div>
                      <div className="card-body text-center py-3">
                        <div className="mb-2">{renderStars(Math.round(p.rating || 0))}</div>
                        <div className="fw-bold" style={{ color: 'var(--primary)' }}>${p.pricePerHour}<small className="text-muted fw-normal">/hr</small></div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollReveal>

      {/* WHY CHOOSE US */}
      <ScrollReveal>
        <div className="mb-5 p-5 border rounded-4" style={{ background: 'var(--surface-2)' }}>
          <h3 className="fw-bold text-center mb-2">Why Choose FixIt?</h3>
          <p className="text-muted text-center mb-5">We make home services simple, safe, and stress-free.</p>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--card-bg)' }}>
                  <div className="p-2 rounded-2 flex-shrink-0" style={{ background: 'var(--primary-light)' }}>
                    <i className={`bi ${f.icon} fs-4`} style={{ color: 'var(--primary)' }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{f.title}</h6>
                    <small className="text-muted">{f.desc}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* HOW IT WORKS */}
      <ScrollReveal>
        <div className="mb-5">
          <h3 className="fw-bold text-center mb-2">How It Works</h3>
          <p className="text-muted text-center mb-5">Get your home service done in three easy steps.</p>
          <div className="row g-4">
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto">1</div>
              <h5 className="fw-bold mt-2">Browse & Choose</h5>
              <p className="text-muted mb-0">Explore categories and pick the right pro for your job.</p>
            </div>
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto" style={{ background: 'var(--success)' }}>2</div>
              <h5 className="fw-bold mt-2">Book & Pay</h5>
              <p className="text-muted mb-0">Schedule at your convenience with secure online payment.</p>
            </div>
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto" style={{ background: 'var(--accent)' }}>3</div>
              <h5 className="fw-bold mt-2">Get It Done</h5>
              <p className="text-muted mb-0">Relax while our expert handles the rest.</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* TESTIMONIALS */}
      <ScrollReveal>
        <div className="mb-5 p-5 border rounded-4" style={{ background: 'var(--surface-2)' }}>
          <h3 className="fw-bold text-center mb-2">What Our Customers Say</h3>
          <p className="text-muted text-center mb-5">Hear from people who've used FixIt.</p>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-4 rounded-3 h-100" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <div className="mb-2">{renderStars(t.rating)}</div>
                  <p className="mb-3" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-2">
                    <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{t.name.charAt(0)}</div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: 14 }}>{t.name}</div>
                      <small className="text-muted">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="hero-section rounded-4 mb-4 text-center text-white p-5">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="fs-5 mb-4 opacity-85">Join thousands of happy customers. Find your expert today.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/services" className="btn btn-light btn-lg fw-semibold px-4 rounded-3">
              <i className="bi bi-search me-2"></i>Find a Service
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg fw-semibold px-4 rounded-3">
              <i className="bi bi-person-plus me-2"></i>Sign Up Free
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
