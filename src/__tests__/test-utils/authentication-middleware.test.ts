import request from 'supertest';
import { api } from '../../api';
import { prisma } from '../../infrastructure/prisma-client';
import { environmentService } from '../../infrastructure/EnvironmentService';

beforeAll(() => {
  environmentService.load();
});

beforeEach(async () => {
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
});

describe('authentication middleware', () => {
  test('Given a valid token, private route returns 200', async () => {
    await request(api).post('/authentication/signup').send({
      email: 'user@email.com',
      password: 'Password123*',
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'user@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .get('/authentication/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBeDefined();
  });

  test('Given no token, private route returns 401', async () => {
    const response = await request(api).get('/authentication/me');

    expect(response.status).toBe(401);
  });
});
