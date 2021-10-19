import { prismaClient } from '../prisma';

export class CreateMessageService {
  async execute(message: string, user_id: string) {
    const newMessage = await prismaClient.message.create({
      data: {
        message,
        user_id,
      },
      include: {
        user: true,
      },
    });

    return newMessage;
  }
}
