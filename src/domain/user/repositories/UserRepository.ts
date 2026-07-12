import { User } from '../User';

export interface CreateUserParams {
  email: string;
  password: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(params: CreateUserParams): Promise<User>;
  findById(id: number): Promise<User | null>;
}
