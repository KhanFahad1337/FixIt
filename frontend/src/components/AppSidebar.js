import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menus = {
  user: [
    { label: 'Home', icon: 'bi-house', path: '/' },
    { label: 'Services', icon: 'bi-grid', path: '/services' },
    { label: 'AI Assistant', icon: 'bi-magic', path: '/ai-tools' },
    { label: 'My Bookings', icon: 'bi-list-check', path: '/my-bookings' },
    { label: 'Favorites', icon: 'bi-heart', path: '/favorites' },
    { label: 'Profile', icon: 'bi-person', path: '/profile' },
  ],
  provider: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/provider-dashboard' },
    { label: 'Edit Profile', icon: 'bi-pencil', path: '/provider-edit-profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin' },
    { label: 'Users', icon: 'bi-people', path: '/admin?tab=users' },
    { label: 'Providers', icon: 'bi-person-badge', path: '/admin?tab=providers' },
    { label: 'Bookings', icon: 'bi-calendar-check', path: '/admin?tab=bookings' },
    { label: 'Reports', icon: 'bi-exclamation-triangle', path: '/admin?tab=reports' },
    { label: 'Sub Admins', icon: 'bi-person-gear', path: '/admin?tab=subadmins' },
  ],
  subadmin: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin' },
    { label: 'Bookings', icon: 'bi-calendar-check', path: '/admin?tab=bookings' },
    { label: 'Reports', icon: 'bi-exclamation-triangle', path: '/admin?tab=reports' },
  ],
};

export default function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const items = menus[user.role] || [];

  return (
    <div className="app-sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.name?.charAt(0) || 'U'}</div>
        <div>
          <div className="sidebar-name">{user.name}</div>
          <div className="sidebar-role">{user.role}</div>
        </div>
      </div>
      {items.map(item => (
        <button
          key={item.path}
          className={`sidebar-link ${location.pathname + location.search === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0])) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
