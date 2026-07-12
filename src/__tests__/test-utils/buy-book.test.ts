import request from 'supertest';
import bcrypt from 'bcrypt';
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

describe('POST /books/:buy', () => {
  test('Given a published book from another user, buys the book successfully', async () => {
    const hashedPassword = await bcrypt.hash('Password123*', 10);

    const seller = await prisma.user.create({
      data: {
        email: 'seller@email.com',
        password: hashedPassword,
      },
    });

    await prisma.user.create({
      data: {
        email: 'buyer@email.com',
        password: hashedPassword,
      },
    });

    const book = await prisma.book.create({
      data: {
        title: 'Clean Code',
        description: 'Libro en perfecto estado',
        price: 20,
        author: 'Robert C. Martin',
        ownerId: seller.id,
      },
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'buyer@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .post(`/books/${book.id}/buy`)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(200);

    const soldBook = await prisma.book.findUnique({
      where: {
        id: book.id,
      },
    });

    expect(soldBook?.status).toBe('SOLD');
    expect(soldBook?.soldAt).not.toBeNull();
  });

  test('Given a non-existing book, returns 404', async () => {
    const hashedPassword = await bcrypt.hash('Password123*', 10);

    await prisma.user.create({
      data: {
        email: 'buyer@email.com',
        password: hashedPassword,
      },
    });

    const loginResponse = await request(api)
      .post('/authentication/signin')
      .send({ email: 'buyer@email.com', password: 'Password123*' });

    const response = await request(api)
      .post('/books/999999/buy')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(404);
  });

  test('Given an already sold book, returns 409', async () => {
    const hashedPassword = await bcrypt.hash('Password123*', 10);

    const seller = await prisma.user.create({
      data: {
        email: 'seller@email.com',
        password: hashedPassword,
      },
    });

    await prisma.user.create({
      data: {
        email: 'buyer@email.com',
        password: hashedPassword,
      },
    });

    const soldBook = await prisma.book.create({
      data: {
        title: 'Clean Code',
        description: 'Libro ya vendido',
        price: 20,
        author: 'Robert C. Martin',
        ownerId: seller.id,
        status: 'SOLD',
        soldAt: new Date(),
      },
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'buyer@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .post(`/books/${soldBook.id}/buy`)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(409);
  });

  test('Given the buyer owns the book, returns 403', async () => {
    const hashedPassword = await bcrypt.hash('Password123*', 10);

    const owner = await prisma.user.create({
      data: {
        email: 'owner@email.com',
        password: hashedPassword,
      },
    });

    const book = await prisma.book.create({
      data: {
        title: 'Clean Code',
        description: 'Libro del propio usuario',
        price: 20,
        author: 'Robert C. Martin',
        ownerId: owner.id,
      },
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'owner@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .post(`/books/${book.id}/buy`)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(403);
  });

  test('Given no authentication token, returns 401', async () => {
    const response = await request(api).post('/books/1/buy');

    expect(response.status).toBe(401);
  });
});
