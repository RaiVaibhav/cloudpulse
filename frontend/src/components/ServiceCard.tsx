import React from 'react';
import { ServiceHealth } from '../types';

interface ServiceCardProps {
  service: ServiceHealth;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'status-operational';
      case 'degraded':
        return 'status-degraded';
      default:
        return 'status-down';
    }
  };

  return (
    <div className="service-card" data-testid={`service-${service.id}`}>
      <div className="service-card-top">
        <div>
          <div className="service-name">{service.name}</div>
          <div className="service-region mono">{service.region}</div>
        </div>
        <span className={`status-badge ${getStatusClass(service.status)}`}>
          ● {service.status}
        </span>
      </div>

      <div className="service-card-bottom">
        <div className="latency-indicator mono">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {service.latencyMs} ms
        </div>
        <div className="mono" style={{ fontSize: '0.75rem' }}>
          {new Date(service.updatedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
