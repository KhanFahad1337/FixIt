import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-modern sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-tools me-2 fs-4"></i>
          <span>FixIt</span>
        </Link>
        <div className="d-flex align-items-center gap-2 order-lg-last">
          <button className="theme-toggle" onClick={toggle} title={`Switch to ${dark ? 'light' : 'dark'} mode`}>
            <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`}></i>
          </button>
          <button className="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i className="bi bi-list fs-3"></i>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!user && <li className="nav-item"><Link className="nav-link" to="/"><i className="bi bi-house me-1"></i>Home</Link></li>}
            {!user && <li className="nav-item"><Link className="nav-link" to="/services"><i className="bi bi-grid me-1"></i>Services</Link></li>}
          </ul>
          <ul className="navbar-nav align-items-center gap-2">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link d-flex align-items-center gap-1" style={{ color: 'var(--text)' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: user.role === 'admin' ? 'var(--gradient-accent)' : 'var(--gradient-1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '0.8rem', fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.3)'
                    }}>
                      {user.name?.charAt(0)}
                    </div>
                    <span className="fw-semibold">{user.name}</span>
                    <span className={`badge ${user.role === 'admin' ? 'badge-modern-danger' : user.role === 'subadmin' ? 'badge-modern-warning' : user.role === 'provider' ? 'badge-modern-primary' : 'badge-modern-success'} ms-1`}>
                      {user.role === 'subadmin' ? 'Sub Admin' : user.role}
                    </span>
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-modern btn-modern-outline btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-modern btn-modern-outline btn-sm" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-modern btn-modern-primary btn-sm" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
