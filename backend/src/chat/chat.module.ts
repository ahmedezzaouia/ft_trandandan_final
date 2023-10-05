import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { channelService } from './channel.service';
import { directMessageService } from './directMessage.service';

@Module({
  providers: [ChatGateway, ChatService, channelService, directMessageService],
  imports: [PrismaModule],
})
export class ChatModule {}
