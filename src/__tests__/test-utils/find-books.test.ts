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
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.total).toBe(2);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);
  });

  test('Returns books matching a partial title search', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'owner@email.com',
        password: 'hashed-password',
      },
    });

    await prisma.book.createMany({
      data: [
        {
          title: 'Clean Code',
          description: 'Libro sobre buenas prácticas',
          price: 20,
          author: 'Robert C. Martin',
          ownerId: user.id,
        },
        {
          title: 'The Pragmatic Programmer',
          description: 'Libro sobre desarrollo profesional',
          price: 25,
          author: 'Andrew Hunt',
          ownerId: user.id,
        },
      ],
    });

    const response = await request(api).get('/books').query({
      page: 1,
      limit: 10,
      search: 'clean',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Clean Code');
  });

  test('Returns books matching a partial author search', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'owner@email.com',
        password: 'hashed-password',
      },
    });

    await prisma.book.createMany({
      data: [
        {
          title: 'Clean Code',
          description: 'Libro sobre buenas prácticas',
          price: 20,
          author: 'Robert C. Martin',
          ownerId: user.id,
        },
        {
          title: 'Harry Potter',
          description: 'Libro de fantasía',
          price: 15,
          author: 'J. K. Rowling',
          ownerId: user.id,
        },
      ],
    });

    const response = await request(api).get('/books').query({
      page: 1,
      limit: 10,
      search: 'row',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].author).toBe('J. K. Rowling');
  });

  test('Does not return sold books', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'owner@email.com',
        password: 'hashed-password',
      },
    });

    await prisma.book.createMany({
      data: [
        {
          title: 'Clean Code',
          description: 'Libro disponible',
          price: 20,
          author: 'Robert C. Martin',
          status: 'PUBLISHED',
          ownerId: user.id,
        },
        {
          title: 'Refactoring',
          description: 'Libro ya vendido',
          price: 18,
          author: 'Martin Fowler',
          status: 'SOLD',
          soldAt: new Date(),
          ownerId: user.id,
        },
      ],
    });

    const response = await request(api).get('/books').query({
      page: 1,
      limit: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('Clean Code');
  });
});
