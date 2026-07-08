import { User } from '../User';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';
import { BusinessConflictError } from '../../errors/BusinessConflictError';

export interface CreateUserUseCaseInput {
  email: string;
  password: string;
}

// Caso de uso encargado de registrar un usuario.
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,

    private readonly securityService: SecurityService,
  ) {}

  // Método principal del caso de uso.
  async execute(input: CreateUserUseCaseInput): Promise<User> {
    // Buscamos si ya existe un usuario con ese email.
    const existingUser = await this.userRepository.findByEmail(input.email);

    // Si existe lanzamos un error de negocio.
    if (existingUser) {
      throw new BusinessConflictError('User already exists');
    }

    // Validamos el email.
    this.validateEmail(input.email);

    // Validamos la contraseña.
    this.validatePassword(input.password);

    const hashedPassword = await this.securityService.hash(input.password);

    const newUser = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
    });

    return newUser;
  }

  // Comprueba que el email tenga un formato válido.
  private validateEmail(email: string) {
    const emailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if (!emailRegExp.test(email)) {
      throw new Error('EMAIL_INVALID');
    }
  }

  // Comprueba que la contraseña sea segura.
  private validatePassword(password: string) {
    const passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/);

    if (!passwordRegExp.test(password)) {
      throw new Error('PW_INVALID');
    }
  }
}
