import React from 'react';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ health, onRefresh, loading }) => {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">CloudPulse</h1>
          <p className="brand-subtitle">
            <span className="live-indicator"></span>
            Observability & Microservices Health Portal
          </p>
        </div>
      </div>

      <div className="header-badges">
        <span className="pill-badge oracle">
          Cloud Region: us-ashburn-1
        </span>
        <span className="pill-badge">
          Env: {health?.environment || 'loading...'}
        </span>
        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>
    </header>
  );
};
