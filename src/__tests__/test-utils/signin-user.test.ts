import request from 'supertest';
import { api } from '../../api';
import { prisma } from '../../infrastructure/prisma-client';
import { environmentService } from '../../infrastructure/EnvironmentService';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  environmentService.load();
});

beforeEach(async () => {
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /authentication/signin', () => {
  test('Given an existing user with valid password, returns a JWT', async () => {
    const signupResponse = await request(api).post('/authentication/signup').send({
      email: 'user@email.com',
      password: 'Password123*',
    });

    expect(signupResponse.status).toBe(201);

    const response = await request(api).post('/authentication/signin').send({
      email: 'user@email.com',
      password: 'Password123*',
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});
