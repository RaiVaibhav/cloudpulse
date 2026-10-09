import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../prisma';

jest.mock('../prisma', () => ({
  prisma: {
    incident: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Incidents API', () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/incidents should return a list of incidents', async () => {
    (prisma.incident.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'Test' }]);
    
    const res = await request(app).get('/api/incidents');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/incidents should create an incident with valid payload', async () => {
    const payload = {
      title: 'High latency on API Gateway',
      service: 'OCI API Gateway',
      severity: 'warning',
      description: 'Investigating sporadic timeout errors on health probes.',
    };

    (prisma.incident.create as jest.Mock).mockResolvedValue({
      id: 'mocked-id',
      ...payload,
      status: 'investigating',
      createdAt: new Date(),
    });


    const res = await request(app).post('/api/incidents').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(payload.title);
    expect(res.body.severity).toBe('warning');
    expect(res.body.status).toBe('investigating');
  });

  it('POST /api/incidents should return 400 when title is missing', async () => {
    const payload = {
      service: 'OCI API Gateway',
      severity: 'warning',
      description: 'Missing title',
    };

    const res = await request(app).post('/api/incidents').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/incidents should return 400 for invalid severity', async () => {
    const payload = {
      title: 'Invalid severity test',
      service: 'Database',
      severity: 'catastrophic', // not one of critical, warning, info
      description: 'Testing severity enum validator',
    };

    const res = await request(app).post('/api/incidents').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('severity');
  });
});
