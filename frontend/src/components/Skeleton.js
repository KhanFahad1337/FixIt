import React from 'react';

export function Skeleton({ width, height, borderRadius = 8, className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width: width || '100%', height: height || 20, borderRadius, ...style }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="col-md-3">
      <div className="stat-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <div className="d-flex flex-column align-items-center gap-2">
          <Skeleton width={52} height={52} borderRadius={12} />
          <Skeleton width={80} height={32} />
          <Skeleton width={100} height={16} />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="col-md-4 col-lg-2 mb-3">
      <div className="category-card">
        <div className="d-flex flex-column align-items-center gap-2">
          <Skeleton width={64} height={64} borderRadius={16} />
          <Skeleton width={90} height={18} />
          <Skeleton width={120} height={14} />
        </div>
      </div>
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="col-md-3">
      <div className="provider-card">
        <div className="provider-header d-flex flex-column align-items-center gap-2" style={{ padding: '1.5rem' }}>
          <Skeleton width={48} height={48} borderRadius={12} />
          <Skeleton width={100} height={18} />
          <Skeleton width={80} height={14} />
        </div>
        <div className="card-body d-flex flex-column align-items-center gap-2">
          <Skeleton width={120} height={16} />
          <Skeleton width={70} height={22} />
        </div>
      </div>
    </div>
  );
}
