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

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /authentication/signup', () => {
  test('Given valid data, a new user is created', async () => {
    const response = await request(api).post('/authentication/signup').send({
      email: 'user@email.com',
      password: 'Password123*',
    });

    expect(response.status).toBe(201);

    const createdUser = await prisma.user.findUnique({
      where: {
        email: 'user@email.com',
      },
    });

    expect(createdUser).not.toBeNull();
  });
});
