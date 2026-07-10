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

describe('POST /books', () => {
  test('Given valid data and valid token, a book is created', async () => {
    await request(api).post('/authentication/signup').send({
      email: 'seller@email.com',
      password: 'Password123*',
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'seller@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .post('/books')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({
        title: 'Clean Code',
        description: 'Libro en perfecto estado',
        price: 20,
        author: 'Robert C. Martin',
      });

    expect(response.status).toBe(201);

    expect(response.body.title).toBe('Clean Code');
    expect(response.body.status).toBe('PUBLISHED');
    expect(response.body.soldAt).toBeNull();
    expect(response.body.ownerId).toBeDefined();

    const createdBook = await prisma.book.findUnique({
      where: {
        id: response.body.id,
      },
    });

    expect(createdBook).not.toBeNull();
  });

  test('Given no token, returns 401', async () => {
    const response = await request(api).post('/books').send({
      title: 'Clean Code',
      description: 'Libro en perfecto estado',
      price: 20,
      author: 'Robert C. Martin',
    });

    expect(response.status).toBe(401);
  });

  test('Given invalid data, returns 400', async () => {
    await request(api).post('/authentication/signup').send({
      email: 'seller@email.com',
      password: 'Password123*',
    });

    const loginResponse = await request(api).post('/authentication/signin').send({
      email: 'seller@email.com',
      password: 'Password123*',
    });

    const response = await request(api)
      .post('/books')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({
        title: '',
        description: 'Libro en perfecto estado',
        price: 20,
        author: 'Robert C. Martin',
      });

    expect(response.status).toBe(400);
  });
});
