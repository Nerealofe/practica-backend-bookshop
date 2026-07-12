import { api } from './api';
import { environmentService } from './infrastructure/EnvironmentService';
import cron from 'node-cron';
import { prisma } from './infrastructure/prisma-client';
import { NodemailerEmailService } from './infrastructure/shared/NodemailerEmailService';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Running Server in http://localhost:${PORT}`);
});

// Todos los lunes a las 09:00
cron.schedule('0 9 * * 1', async () => {
  console.log('Running weekly book price suggestion cron');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const books = await prisma.book.findMany({
    where: {
      status: 'PUBLISHED',
      createdAt: {
        lt: sevenDaysAgo,
      },
    },
    include: {
      owner: true,
    },
  });

  const emailService = new NodemailerEmailService();
  for (const book of books) {
    try {
      await emailService.send({
        email: book.owner.email,
        subject: 'Sugerencia para mejorar la venta de tu libro',
        message: `Tu libro "${book.title}" lleva más de 7 días publicado. Considera revisar o bajar el precio.`,
      });
    } catch (error) {
      console.error(`Error sending price suggestion email for book ${book.id}:`, error);
    }
  }
});
