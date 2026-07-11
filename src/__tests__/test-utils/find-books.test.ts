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

describe('GET /books', () => {
  test('Given existing books, returns a paginated list', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'owner@email.com',
        password: 'hashed-password',
      },
    });

    await prisma.book.create({
      data: {
        title: 'Clean Code',
        description: 'Libro sobre buenas prácticas de programación',
        price: 20,
        author: 'Robert C. Martin',
        ownerId: user.id,
      },
    });

    await prisma.book.create({
      data: {
        title: 'The pragmatic Programmer',
        description: 'Libro sobre desarrollo profesional de software',
        price: 25,
        author: 'Andrew Hunt',
        ownerId: user.id,
      },
    });

    const response = await request(api).get('/books').query({
      page: 1,
      limit: 10,
    });

    expect(response.status).toBe(200);
  });
});
