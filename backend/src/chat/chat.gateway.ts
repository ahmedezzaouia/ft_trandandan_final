import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelService } from './channel.service';
import { directMessageService } from './directMessage.service';
import { notificationService } from './notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly directMessageService: directMessageService,
    private readonly channelService: channelService,
    private readonly prisma: PrismaService,
    private readonly notificationService: notificationService,
  ) {}

  // channalMessage
  @SubscribeMessage('channelMessage')
  async channelMessage(
    @MessageBody()
    data: {
      sender: string;
      channel: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const saveMessage = await this.channelService.createChannelMessage(data);
    this.server.to(data.channel).emit('channelMessage', saveMessage);
    return saveMessage;
  }

  // todo idono if that work with all
  // Join a specific channel room
  @SubscribeMessage('joinChannel')
  async joinChannel(
    @MessageBody()
    data: { channel: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.channel);
  }

  // list messages for a channel
  @SubscribeMessage('listChannelMessages')
  async listChannelMessages(
    @MessageBody()
    data: {
      channel: string;
      sender: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // save the messages in an array where ChannelMessage is an object with the message and user
      const messages = await this.channelService.listChannelMessages(data);

      if (messages && messages.length > 0) {
        let msg = [];
        messages.forEach((element) => {
          if (element.ChannelMessage) {
            element.ChannelMessage.forEach((el) => {
              msg.push(el);
            });
          }
        });

        this.server.to(data.channel).emit('listChannelMessages', { msg });
        return msg;
      } else {
        console.error('No messages found.');
        return []; // Return an empty array or handle it according to your application's logic
      }
    } catch (error) {
      console.error('Error while fetching messages:', error);
      throw error; // Rethrow the error to handle it in your calling code
    }
  }

  // saveChannelName to database
  @SubscribeMessage('saveChannelName')
  async saveChannelName(
    @MessageBody()
    data: {
      channel: string;
      sender: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.sender,
      },
    });

    const checkChannel = await this.prisma.channel.findUnique({
      where: {
        name: data.channel,
      },
    });
    if (checkChannel) {
      throw new Error('Channel already exists');
    }
    const saveChannel = await this.prisma.channel.create({
      data: {
        name: data.channel,
        user: {
          connect: {
            username: user.username,
          },
        },
      },
    });
    this.server.emit('saveChannelName', saveChannel);
    return saveChannel;
  }

  // get all channels
  @SubscribeMessage('listChannels')
  async listChannels(
    @MessageBody() data: { sender: string; channel: string },
    @ConnectedSocket() client: Socket,
  ) {
    const channels = await this.channelService.listChannels(data);
    this.server.to(data.channel).emit('listChannels', channels);
    return channels;
  }

  // get all users
  @SubscribeMessage('getAllUsers')
  async listUsers(
    @MessageBody() data: { sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    const users = await this.prisma.user.findMany({
      include: {
        channel: true,
      },
    });
    // console.log('users', users);
    this.server.emit('getAllUsers', users);
    return users;
  }


  // directMessage
  @SubscribeMessage('directMessage')
  async directMessage(
    @MessageBody()
    data: {
      sender: string;
      reciever: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const saveMessage = await this.directMessageService.createDirectMessage(data);
    this.server.to(data.reciever).emit('directMessage', saveMessage);
    return saveMessage;
  }

  // listDirectMessages for a both users
  @SubscribeMessage('listDirectMessages')
  async listDirectMessages(
    @MessageBody()
    data: {
      sender: string;
      reciever: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // save the messages in an array where ChannelMessage is an object with the message and user
      const messages = await this.directMessageService.listDirectMessages(data);

      const user = await this.prisma.user.findUnique({
        where: {
          username: data.sender,
        },
      });

      if (messages && messages.length > 0) {
        let msg = [];
        messages.forEach((element) => {
          if (element.message) {
            msg.push(element);
          }
        })
        
        this.server.emit('listDirectMessages', { msg });
        console.log("🚀 ~ file: chat.gateway.ts:198 ~ ChatGateway ~ msg:", msg)
        // return as array of objects
        return msg;
      } else {
        console.error('No messages found.');
        return []; // Return an empty array or handle it according to your application's logic
      }
    } catch (error) {
      console.error('Error while fetching messages:', error);
      throw error; // Rethrow the error to handle it in your calling code
    }
  }


  // search for a user
  @SubscribeMessage('searchUser')
  async searchUser(
    @MessageBody()
    data: {
      user: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log("user search", data.user)
      const user = await this.prisma.user.findMany({
        where: {
          username: {
            contains: data.user,
          },
        },
      });
      this.server.emit('searchUser', user); // this will return all users
      console.log("🚀 ~ file: chat.gateway.ts:237 ~ ChatGateway ~ user:", user)
      return user;
    } catch (error) {
      console.error('Error while fetching messages:', error);
      throw error; // Rethrow the error to handle it in your calling code
    }
  }


  // add friend to user by id 
  @SubscribeMessage('sendFriendRequest')
  async sendFriendRequest(
    @MessageBody()
    data : {
      reciverInvite: string;
      senderIvite: string;
    }
  ) {
    try {
      if (!data.reciverInvite || !data.senderIvite) {
  return;      }
      // console.log("friend search", data.reciverInvite)
      // console.log("friend search", data.senderIvite)
      const friend = await this.notificationService.addFriend(data);
      this.server.emit('sendFriendRequest', friend); // this will return all users
      return friend;
    }
    catch (error) {
      console.error('Error while fetching messages:', error);
      throw error; // Rethrow the error to handle it in your calling code
    }
  }


  // list all notification for a user
  @SubscribeMessage('notification')
  async listFriendRequest(
    @MessageBody()
    data : {
      username: string;
    }
  ) {
    try {
      console.log("----", data.username)
      const notification = await this.notificationService.listFriendRequest(data);
      this.server.emit('notification', notification); // this will return all users
      console.log("🚀 ~ file: chat.gateway.ts:237 ~ ChatGateway ~ user:", {notification})
      return notification;
    }
    catch (error) {
      console.error('Error while fetching messages:', error);
      throw error; // Rethrow the error to handle it in your calling code
    }
  }
}
