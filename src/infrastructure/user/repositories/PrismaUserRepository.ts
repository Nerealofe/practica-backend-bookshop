import { User } from '../../../domain/user/User';
import { CreateUserParams, UserRepository } from '../../../domain/user/repositories/UserRepository';
import { prisma } from '../../prisma-client';

export class PrismaUserRepository implements UserRepository {
  private readonly prisma = prisma;

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!prismaUser) {
      return null;
    }

    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
    });
  }

  async create(params: CreateUserParams): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: params.email,
        password: params.password,
      },
    });

    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
    });
  }
}
