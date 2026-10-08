import { Request, Response, Router } from 'express';
import { ServiceHealth } from '../types';

export const servicesRouter = Router();

let mockServices: ServiceHealth[] = [
  {
    id: 'srv-gateway',
    name: 'OCI API Gateway',
    status: 'operational',
    latencyMs: 18,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-auth',
    name: 'Auth & Identity Service',
    status: 'operational',
    latencyMs: 34,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-db',
    name: 'Autonomous Database (ATP)',
    status: 'operational',
    latencyMs: 12,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-cache',
    name: 'Redis Cluster Cache',
    status: 'operational',
    latencyMs: 4,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-queue',
    name: 'OCI Streaming & Queue',
    status: 'degraded',
    latencyMs: 142,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-worker',
    name: 'Background Worker Daemon',
    status: 'operational',
    latencyMs: 25,
    region: 'us-ashburn-1',
    updatedAt: new Date().toISOString(),
  },
];

servicesRouter.get('/', (_req: Request, res: Response) => {
  // Update timestamp dynamically
  const updatedList = mockServices.map((svc) => ({
    ...svc,
    updatedAt: new Date().toISOString(),
  }));
  res.status(200).json(updatedList);
});

servicesRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, latencyMs } = req.body;

  const service = mockServices.find((s) => s.id === id);
  if (!service) {
    res.status(404).json({ error: `Service with id '${id}' not found` });
    return;
  }

  if (status) service.status = status;
  if (typeof latencyMs === 'number') service.latencyMs = latencyMs;
  service.updatedAt = new Date().toISOString();

  res.status(200).json(service);
});
