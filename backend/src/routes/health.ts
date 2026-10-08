import { Request, Response, Router } from 'express';
import { HealthResponse } from '../types';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  const payload: HealthResponse = {
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    memoryUsage: {
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
    },
  };

  res.status(200).json(payload);
});
