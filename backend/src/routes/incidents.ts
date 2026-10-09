import { Request, Response, Router } from 'express';
import { CreateIncidentPayload, Incident } from '../types';

import { prisma } from '../prisma';

export const incidentsRouter = Router();

incidentsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Failed to fetch incidents from database', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

incidentsRouter.post('/', async (req: Request, res: Response) => {
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

  try {
    const newIncident = await prisma.incident.create({
      data: {
        title: body.title.trim(),
        service: body.service.trim(),
        severity: body.severity,
        description: body.description.trim(),
        status: 'investigating',
      },
    });

    res.status(201).json(newIncident);
  } catch (error) {
    console.error('Failed to insert incident into database', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});
