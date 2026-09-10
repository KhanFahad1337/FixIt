import React, { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem('fixit-install-dismissed')) {
        setShowBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      localStorage.setItem('fixit-install-dismissed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('fixit-install-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'var(--card-bg, #1a1a2e)',
      borderTop: '2px solid var(--primary)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="d-flex align-items-center gap-2">
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'var(--gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="bi bi-tools text-white"></i>
        </div>
        <div>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Install FixIt</strong>
          <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Add to home screen for quick access</p>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button onClick={handleDismiss} className="btn btn-sm" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Later
        </button>
        <button onClick={handleInstall} className="btn btn-sm" style={{
          background: 'var(--primary)',
          color: 'white',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8rem',
        }}>
          <i className="bi bi-download me-1"></i>Install
        </button>
      </div>
    </div>
  );
}
