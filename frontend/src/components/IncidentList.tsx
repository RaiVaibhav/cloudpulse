import React from 'react';
import { Incident } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  onUpdate: (id: string, updates: { status?: string; severity?: string }) => void;
  onDelete: (id: string) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, onUpdate, onDelete }) => {
  if (incidents.length === 0) {
    return (
      <div className="empty-state">
        <p>No operational incidents reported. All cloud systems nominal.</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'warning':
        return 'severity-warning';
      default:
        return 'severity-info';
    }
  };

  return (
    <div className="incidents-container">
      {incidents.map((inc) => (
        <div key={inc.id} className="incident-item" data-testid={`incident-${inc.id}`}>
          <span className={`severity-tag ${getSeverityBadge(inc.severity)}`}>
            {inc.severity}
          </span>
          <div className="incident-content">
            <h4 className="incident-title">{inc.title}</h4>
            <p className="incident-desc">{inc.description}</p>
            <div className="incident-meta mono">
              <span>Service: {inc.service}</span>
              <span>Status: {inc.status}</span>
              <span>{new Date(inc.timestamp).toLocaleString()}</span>
            </div>
          </div>
          <div className="incident-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: 'auto' }}>
            {inc.status !== 'resolved' && (
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
                onClick={() => onUpdate(inc.id, { status: 'resolved' })}
              >
                Resolve
              </button>
            )}
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', cursor: 'pointer', borderColor: 'var(--severity-critical)', color: 'var(--severity-critical)' }}
              onClick={() => onDelete(inc.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
