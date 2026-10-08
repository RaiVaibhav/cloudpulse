import React, { useState } from 'react';
import { IncidentSeverity, ServiceHealth } from '../types';

interface IncidentModalProps {
  services: ServiceHealth[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    service: string;
    severity: IncidentSeverity;
    description: string;
  }) => Promise<void>;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  services,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [service, setService] = useState(services[0]?.name || 'API Gateway');
  const [severity, setSeverity] = useState<IncidentSeverity>('warning');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({ title, service, severity, description });
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to report incident. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="modal-title">Log System Incident</h3>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="incident-title">
              Incident Summary *
            </label>
            <input
              id="incident-title"
              className="form-input"
              type="text"
              placeholder="e.g. Unresponsive ATP Read Replica"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="incident-service">
              Target Service *
            </label>
            <select
              id="incident-service"
              className="form-select"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {services.map((svc) => (
                <option key={svc.id} value={svc.name}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="incident-severity">
              Severity Level *
            </label>
            <select
              id="incident-severity"
              className="form-select"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
            >
              <option value="critical">Critical (P1)</option>
              <option value="warning">Warning (P2)</option>
              <option value="info">Info / Notice (P3)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="incident-desc">
              Description & Mitigations *
            </label>
            <textarea
              id="incident-desc"
              className="form-textarea"
              rows={4}
              placeholder="Provide context, root cause, and initial remediation steps taken..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Register Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
