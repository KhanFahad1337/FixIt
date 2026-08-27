import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import API from '../config';
import useCountUp from '../hooks/useCountUp';
import ScrollReveal from '../components/ScrollReveal';
import { StatCardSkeleton, CategoryCardSkeleton, ProviderCardSkeleton } from '../components/Skeleton';

const professions = [
  { name: 'Electrician', icon: 'bi-lightning-charge-fill', desc: 'Wiring, repairs, installations & more', color: '#f59e0b' },
  { name: 'Plumber', icon: 'bi-droplet-fill', desc: 'Pipes, drainage, water heaters', color: '#06b6d4' },
  { name: 'Painter', icon: 'bi-brush-fill', desc: 'Interior & exterior painting', color: '#8b5cf6' },
  { name: 'AC Technician', icon: 'bi-snow2', desc: 'Repair, installation, servicing', color: '#0ea5e9' },
  { name: 'Carpenter', icon: 'bi-hammer', desc: 'Furniture, cabinets, woodwork', color: '#d97706' },
  { name: 'Cleaner', icon: 'bi-stars', desc: 'Home & office cleaning', color: '#10b981' },
];

const features = [
  { icon: 'bi-shield-check', title: 'Verified Professionals', desc: 'Every provider is background-checked and approved by our team.' },
  { icon: 'bi-clock-history', title: 'Flexible Scheduling', desc: 'Book at your convenience with real-time availability.' },
  { icon: 'bi-receipt', title: 'Transparent Pricing', desc: 'Know the cost upfront — no hidden fees or surprises.' },
  { icon: 'bi-headset', title: '24/7 Support', desc: 'Our chatbot and support team are here whenever you need help.' },
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
  const iconMap = { 'Verified Pros': 'bi-people-fill', 'Jobs Completed': 'bi-check-circle-fill', 'Avg Rating': 'bi-star-fill', 'Satisfaction': 'bi-emoji-smile-fill' };
  return (
    <div className="col-md-3" ref={ref}>
      <div className={`stat-card ${gradient || ''}`} style={!gradient ? { background: 'var(--warning)', color: 'var(--text-white)' } : {}}>
        <i className={`bi ${iconMap[label] || 'bi-emoji-smile'} stat-icon`}></i>
        <h2 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>{display}</h2>
        <p className="mb-0 opacity-80" style={{ fontSize: '0.9rem' }}>{label}</p>
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
      stars.push(<i key={i} className={`bi ${i <= n ? 'bi-star-fill' : 'bi-star'} text-warning me-1`} style={{ fontSize: 13 }}></i>);
    }
    return stars;
  };

  return (
    <div>
      {/* HERO */}
      <div className="hero-section mb-5 text-white animate-fade-in overflow-hidden">
        {/* Floating decorative shapes */}
        <div className="hero-shape" style={{ width: 80, height: 80, background: 'rgba(124,58,237,0.3)', top: '15%', left: '8%', animationDuration: '6s' }}></div>
        <div className="hero-shape" style={{ width: 50, height: 50, background: 'rgba(6,182,212,0.3)', top: '60%', left: '5%', animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="hero-shape" style={{ width: 35, height: 35, background: 'rgba(251,191,36,0.25)', bottom: '20%', right: '25%', animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="hero-shape" style={{ width: 60, height: 60, background: 'rgba(16,185,129,0.2)', top: '25%', right: '10%', animationDuration: '9s' }}></div>
        <div className="hero-shape" style={{ width: 25, height: 25, background: 'rgba(244,63,94,0.25)', bottom: '30%', left: '15%', animationDuration: '5s', animationDelay: '0.5s' }}></div>

        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-7 p-5">
            <span className="badge px-3 py-2 rounded-pill mb-3 animate-fade-in delay-1" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-white)', fontSize: '0.85rem' }}>
              <i className="bi bi-patch-check-fill me-1" style={{ color: '#fbbf24' }}></i> Trusted by 10,000+ Customers
            </span>
            <h1 className="display-3 fw-bold mb-3 lh-1 animate-fade-in-up delay-2" style={{ letterSpacing: '-1px' }}>
              Your Home,<br />
              <span className="gradient-text" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Our Experts</span>
            </h1>
            <p className="fs-5 mb-4 animate-fade-in-up delay-3" style={{ maxWidth: 520, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
              Connect with verified professionals for all your home services — from electrical repairs to deep cleaning, we've got you covered.
            </p>
            <div className="d-flex gap-3 flex-wrap animate-fade-in-up delay-4">
              <Link to="/services" className="btn btn-light btn-lg fw-semibold px-4 rounded-3 shadow-sm" style={{ transition: 'var(--transition-bounce)' }}>
                <i className="bi bi-search me-2"></i>Find a Service
              </Link>
              <Link to="/register?role=provider" className="btn btn-lg fw-semibold px-4 rounded-3" style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', transition: 'var(--transition)' }}>
                <i className="bi bi-person-plus me-2"></i>Join as Pro
              </Link>
            </div>
            <div className="d-flex align-items-center gap-4 mt-4 animate-fade-in delay-5">
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex">
                  {[1,2,3,4,5].map(i => <i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: 14 }}></i>)}
                </div>
                <small style={{ color: 'rgba(255,255,255,0.75)' }}>4.8 average rating</small>
              </div>
              <small style={{ color: 'rgba(255,255,255,0.75)' }}><i className="bi bi-people me-1"></i>{stats.totalProviders || 0}+ pros</small>
            </div>
          </div>
          <div className="col-lg-5 text-center p-4 d-none d-lg-block animate-slide-right delay-3">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div className="display-1" style={{ opacity: 0.9, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>
                <i className="bi bi-tools"></i>
              </div>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: 'rgba(251,191,36,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(251,191,36,0.4)', animation: 'bounce 2s ease-in-out infinite' }}>
                <i className="bi bi-check-lg fs-4 text-dark"></i>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 20, width: 50, height: 50, borderRadius: '50%', background: 'rgba(16,185,129,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(16,185,129,0.4)', animation: 'bounce 2s ease-in-out 0.5s infinite' }}>
                <i className="bi bi-star-fill fs-5 text-white"></i>
              </div>
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
            <h3 className="fw-bold mb-0 d-flex align-items-center">
              <span className="section-icon"><i className="bi bi-grid-3x3-gap-fill"></i></span>
              Service Categories
            </h3>
            <Link to="/services" className="btn btn-modern btn-modern-outline btn-sm">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {professions.map((p, i) => (
              <div className="col-md-4 col-lg-2" key={i}>
                <Link to={`/services/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-decoration-none">
                  <div className="category-card" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="icon-wrap" style={{ background: `${p.color}18`, color: p.color }}>
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
          <div className="mb-5"><h3 className="fw-bold mb-4 d-flex align-items-center"><span className="section-icon"><i className="bi bi-trophy-fill"></i></span>Top Rated Professionals</h3><div className="row g-4"><ProviderCardSkeleton /><ProviderCardSkeleton /><ProviderCardSkeleton /><ProviderCardSkeleton /></div></div>
        ) : topProviders.length > 0 && (
          <div className="mb-5">
            <h3 className="fw-bold mb-4 d-flex align-items-center">
              <span className="section-icon"><i className="bi bi-trophy-fill"></i></span>
              Top Rated Professionals
            </h3>
            <div className="row g-4">
              {topProviders.map((p, i) => (
                <div className="col-md-3" key={p._id}>
                  <Link to={`/provider/${p._id}`} className="text-decoration-none">
                    <div className="provider-card" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="provider-header" style={{ padding: '1.25rem' }}>
                        <div className="provider-avatar mx-auto" style={{ width: 52, height: 52, fontSize: 18 }}>
                          {p.name?.charAt(0)}
                        </div>
                        <h6 className="fw-bold mt-2 mb-0 text-white">{p.name}</h6>
                        <small className="opacity-75">{p.profession}</small>
                      </div>
                      <div className="card-body text-center py-3">
                        <div className="mb-2">{renderStars(Math.round(p.rating || 0))}</div>
                        <div className="price-tag">${p.pricePerHour}<small className="text-muted fw-normal">/hr</small></div>
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
        <div className="mb-5 p-5 rounded-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <h3 className="fw-bold text-center mb-2 d-flex align-items-center justify-content-center">
            <span className="section-icon me-2"><i className="bi bi-patch-check-fill"></i></span>
            Why Choose FixIt?
          </h3>
          <p className="text-muted text-center mb-5" style={{ fontSize: '1.05rem' }}>We make home services simple, safe, and stress-free.</p>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="feature-card">
                  <div className="d-flex align-items-start gap-3">
                    <div className="feature-icon">
                      <i className={`bi ${f.icon}`}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{f.title}</h6>
                      <small className="text-muted">{f.desc}</small>
                    </div>
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
          <p className="text-muted text-center mb-5" style={{ fontSize: '1.05rem' }}>Get your home service done in three easy steps.</p>
          <div className="row g-4">
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto">1</div>
              <h5 className="fw-bold mt-3">Browse & Choose</h5>
              <p className="text-muted mb-0">Explore categories and pick the right pro for your job.</p>
            </div>
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto" style={{ background: 'var(--gradient-2)' }}>2</div>
              <h5 className="fw-bold mt-3">Book & Pay</h5>
              <p className="text-muted mb-0">Schedule at your convenience with secure online payment.</p>
            </div>
            <div className="col-md-4 process-step">
              <div className="step-number mx-auto" style={{ background: 'var(--gradient-accent)' }}>3</div>
              <h5 className="fw-bold mt-3">Get It Done</h5>
              <p className="text-muted mb-0">Relax while our expert handles the rest.</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* TESTIMONIALS */}
      <ScrollReveal>
        <div className="mb-5 p-5 rounded-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <h3 className="fw-bold text-center mb-2">What Our Customers Say</h3>
          <p className="text-muted text-center mb-5" style={{ fontSize: '1.05rem' }}>Hear from people who've used FixIt.</p>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="testimonial-card h-100">
                  <div className="mb-3">{renderStars(t.rating)}</div>
                  <p className="mb-3" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7 }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-2">
                    <div className="sidebar-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{t.name.charAt(0)}</div>
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
        <div className="cta-section mb-4 text-center text-white p-5" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.2rem' }}>Ready to Get Started?</h2>
            <p className="fs-5 mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>Join thousands of happy customers. Find your expert today.</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/services" className="btn btn-light btn-lg fw-semibold px-4 rounded-3">
                <i className="bi bi-search me-2"></i>Find a Service
              </Link>
              <Link to="/register" className="btn btn-lg fw-semibold px-4 rounded-3" style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
                <i className="bi bi-person-plus me-2"></i>Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
