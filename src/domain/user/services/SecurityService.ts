export interface SecurityService {
  hash(value: string): Promise<string>;
  comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateJwt(userId: number): string;
  verifyJwt(token: string): { iat: number; userId: number } | null;
}
