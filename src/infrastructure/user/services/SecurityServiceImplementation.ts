// Importamos bcrypt para proteger contraseñas.
import bcrypt from 'bcrypt';

// Importamos jsonwebtoken para generar y verificar JWT.
import jwt from 'jsonwebtoken';

// Importamos el contrato que debemos cumplir.
import { SecurityService } from '../../../domain/user/services/SecurityService';

// Importamos las variables de entorno.
import { environmentService } from '../../EnvironmentService';

// Esta clase implementa el contrato SecurityService.
export class SecurityServiceImplementation implements SecurityService {
  // Guardamos la clave secreta del JWT.
  private readonly SECRET_KEY: string;

  constructor() {
    this.SECRET_KEY = environmentService.get().JWT_SECRET;
  }

  // Convierte una contraseña normal en una contraseña hasheada.
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(value, salt);

    return hashedPassword;
  }

  // Compara una contraseña normal con una contraseña hasheada.
  comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Genera un JWT con el id del usuario.
  generateJwt(userId: number): string {
    return jwt.sign({ userId }, this.SECRET_KEY);
  }

  // Verifica que un JWT sea válido.
  verifyJwt(token: string): { iat: number; userId: number } | null {
    try {
      const decodedToken = jwt.verify(token, this.SECRET_KEY);

      return decodedToken as { iat: number; userId: number };
    } catch {
      return null;
    }
  }
}
