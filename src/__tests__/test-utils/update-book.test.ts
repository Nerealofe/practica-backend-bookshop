import request from 'supertest';
import bcrypt from 'bcrypt';
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

describe('PUT /books/:id', () => {
  test('Given the owner os a published book, updates it succesfully', async () => {
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
        description: 'Old description',
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
      .put(`/books/${book.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({
        title: 'Clean Code Second Edition',
        description: 'New description',
        price: 30,
        author: 'Robert C. Martin',
      });

    expect(response.status).toBe(200);

    const updatedBook = await prisma.book.findUniqueOrThrow({
      where: {
        id: book.id,
      },
    });

    expect(updatedBook.title).toBe('Clean Code Second Edition');
    expect(updatedBook.description).toBe('New description');
    expect(updatedBook.price).toBe(30);
  });
});
