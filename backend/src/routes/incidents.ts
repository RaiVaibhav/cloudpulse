import { Request, Response, Router } from 'express';
import { CreateIncidentPayload, Incident } from '../types';

export const incidentsRouter = Router();

let incidents: Incident[] = [
  {
    id: 'inc-101',
    title: 'Elevated latency on OCI Streaming queue consumer',
    service: 'OCI Streaming & Queue',
    severity: 'warning',
    description: 'High burst of incoming telemetry packets causing message queue buffer backlog.',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'investigating',
  },
  {
    id: 'inc-100',
    title: 'Autonomous Database scheduled maintenance completed',
    service: 'Autonomous Database (ATP)',
    severity: 'info',
    description: 'Quarterly rolling security patch applied with zero downtime failover.',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'resolved',
  },
];

incidentsRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json(incidents);
});

incidentsRouter.post('/', (req: Request, res: Response) => {
  const body: Partial<CreateIncidentPayload> = req.body;

  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    res.status(400).json({ error: 'Field "title" is required and cannot be empty.' });
    return;
  }

  if (!body.service || typeof body.service !== 'string' || body.service.trim().length === 0) {
    res.status(400).json({ error: 'Field "service" is required and cannot be empty.' });
    return;
  }

  if (!body.severity || !['critical', 'warning', 'info'].includes(body.severity)) {
    res.status(400).json({
      error: 'Field "severity" must be one of: "critical", "warning", "info".',
    });
    return;
  }

  if (!body.description || typeof body.description !== 'string') {
    res.status(400).json({ error: 'Field "description" is required.' });
    return;
  }

  const newIncident: Incident = {
    id: `inc-${Date.now().toString(36)}`,
    title: body.title.trim(),
    service: body.service.trim(),
    severity: body.severity,
    description: body.description.trim(),
    timestamp: new Date().toISOString(),
    status: 'investigating',
  };

  incidents.unshift(newIncident);
  res.status(201).json(newIncident);
});
