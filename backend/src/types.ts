export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  region: string;
  updatedAt: string;
}

export type IncidentSeverity = 'critical' | 'warning' | 'info';
export type IncidentStatus = 'investigating' | 'identified' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  description: string;
  timestamp: string;
  status: IncidentStatus;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  memoryUsage: {
    rssMb: number;
    heapUsedMb: number;
  };
}

export interface CreateIncidentPayload {
  title: string;
  service: string;
  severity: IncidentSeverity;
  description: string;
}
