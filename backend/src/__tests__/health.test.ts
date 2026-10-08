import request from 'supertest';
import { createApp } from '../app';

describe('Health Check API', () => {
  const app = createApp();

  it('GET /health should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('uptimeSeconds');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('memoryUsage');
  });

  it('GET /unknown-endpoint should return 404', async () => {
    const res = await request(app).get('/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Endpoint not found');
  });
});
