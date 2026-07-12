import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';
import { EmailService } from '../../shared/EmailService';
import { UserRepository } from '../../user/repositories/UserRepository';

export interface BuyBookUseCaseInput {
  bookId: number;
  buyerId: number;
}

export class BuyBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: BuyBookUseCaseInput): Promise<Book> {
    const book = await this.bookRepository.findById(input.bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', String(input.bookId));
    }
    if (book.status === 'SOLD') {
      throw new BusinessConflictError('Book already sold');
    }
    if (book.ownerId === input.buyerId) {
      throw new ForbiddenOperationError('You cannot buy your own book');
    }

    const seller = await this.userRepository.findById(book.ownerId);

    if (!seller) {
      throw new EntityNotFoundError('User', String(book.ownerId));
    }

    const soldBook = await this.bookRepository.markAsSold(book.id, new Date());

    try {
      await this.emailService.send({
        email: seller.email,
        subject: 'Tu libro se ha vendido',
        message: `El libro "${book.title}" se ha vendido correctamente.`,
      });
    } catch (error) {
      console.error('Error sending book sold email:', error);
    }

    return soldBook;
  }
}
