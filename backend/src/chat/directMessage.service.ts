import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class directMessageService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------ create direct Message ------------------
  async createDirectMessage(data: {
    sender: string;
    reciever: string;
    message: string;
  }) {
    console.log("🚀 ~ file: directMessage.service.ts:14 ~ directMessageService ~ message:", data.message)
    console.log("🚀 ~ file: directMessage.service.ts:14 ~ directMessageService ~ reciever:", data.reciever)
    console.log("🚀 ~ file: directMessage.service.ts:14 ~ directMessageService ~ sender:", data.sender)

    
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.sender,
      },
    });
    const reciever = await this.prisma.user.findUnique({
      where: {
        username: data.reciever,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (!reciever) {
      throw new Error('reciever not found');
    }
    const createDirectMessage = await this.prisma.directMessage.create({
      data: {
        message: data.message,
        sender: {
          connect: {
            username: data.sender,
          },
        },
        receiver: {
          connect: {
            username: data.reciever,
          },
        },
      },
    });
    return createDirectMessage;
  }


  //listDirectMessages 
  async listDirectMessages(data: {
    sender: string;
    reciever: string;
  }) {
    
    console.log("sender in backend", data.sender)
    console.log("reciever in backend", data.reciever)
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.sender,
      },
    });
    console.log("🚀 ~ file: directMessage.service.ts:67 ~ directMessageService ~ user:", user)
    
    const reciever = await this.prisma.user.findUnique({
      where: {
        username: data.reciever,
      },
    });
    console.log("🚀 ~ file: directMessage.service.ts:74 ~ directMessageService ~ reciever:", reciever)
    
    if (!user) {
      throw new Error('User not found');
    }
    if (!reciever) {
      throw new Error('reciever not found');
    }

    // list both sender and reciever messages
    const listDirectMessages = await this.prisma.directMessage.findMany({
      where: {
        OR: [
          {
            sender: {
              username: data.sender,
            },
            receiver: {
              username: data.reciever,
            },
          },
          {
            sender: {
              username: data.reciever,
            },
            receiver: {
              username: data.sender,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: true,
        receiver: true,
      },
      
    });
    return listDirectMessages;
  }
}
