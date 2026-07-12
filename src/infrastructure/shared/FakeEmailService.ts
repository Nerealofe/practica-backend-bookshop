import { EmailService } from '../../domain/shared/EmailService';

export class FakeEmailService implements EmailService {
  async send(): Promise<void> {
    return;
  }
}
