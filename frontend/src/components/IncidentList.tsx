import React from 'react';
import { Incident } from '../types';

interface IncidentListProps {
  incidents: Incident[];
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
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
        </div>
      ))}
    </div>
  );
};
