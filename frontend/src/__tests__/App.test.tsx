import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('CloudPulse App Integration', () => {
  it('renders application header and title', async () => {
    render(<App />);
    expect(screen.getByText('CloudPulse')).toBeDefined();
    expect(screen.getByText(/OCI Observability & Microservices Health Portal/i)).toBeDefined();
  });

  it('renders metrics cards', () => {
    render(<App />);
    expect(screen.getByText('System Health')).toBeDefined();
    expect(screen.getByText('Average Latency')).toBeDefined();
    expect(screen.getByText('Active Incidents')).toBeDefined();
  });

  it('opens the incident report modal upon clicking "+ Log Incident"', () => {
    render(<App />);
    const button = screen.getByTestId('report-incident-btn');
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(screen.getByText('Log System Incident')).toBeDefined();
    expect(screen.getByLabelText(/Incident Summary \*/i)).toBeDefined();
  });
});
