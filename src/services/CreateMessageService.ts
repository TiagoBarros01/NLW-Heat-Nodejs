import { io } from '../app';
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

    const infoWS = {
      message: newMessage.message,
      user_id: newMessage.user_id,
      createdAt: newMessage.created_at,
      user: {
        name: newMessage.user.name,
        avatar_url: newMessage.user.avatar_url,
      },
    };

    io.emit('new_message', infoWS);

    return newMessage;
  }
}
