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
import { channel } from 'diagnostics_channel';

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
    private readonly channelService: channelService,
    private readonly prisma: PrismaService,
  ) {}

  // @SubscribeMessage('directMessage')
  // async create(@MessageBody() data: { sender: string,  receiver?: string, message: string }
  // , @ConnectedSocket() client: Socket,) {
  //   // save message to database
  //   console.log("on backend  ------ ",data);
  //   let user = null;
  //   let message = null;
  //   // check if user exists if not create user
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: {
  //       username: data.sender,
  //     },
  //   });

  //   // create a default user
  //     const receiver = await this.prisma.user.create({
  //       data: {
  //         username: "joey",
  //         email: "joey@gmail.com",
  //         isTwofactorsEnabled: false,
  //         twoFactorsSecret: "secret",
  //         avatarUrl: "data:image/jpeg;base64,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",
  //       }
  //     });

  //   if (existingUser) {
  //     console.log("User exists");
  //     // console.log("existing User", existingUser);
  //     console.log("receiver", data.receiver)

  //     // Create the message for sender
  //     message = await this.prisma.directMessage.create({
  //       data: {
  //         sender: user.id, // Use the user's id as the sender
  //         message: data.message,
  //         receiver: {
  //           connect: {
  //             username: data.receiver,
  //           }
  //         }
  //       }
  //     });

  //   } else {
  //       console.log("User does not exist");
  //     }

  //   // this.server.emit('newMessage', message);
  //   // i want to broadcast to the receiver and sender in the same time
  //   this.server.to(data.receiver).emit('newMessage', message);
  //   this.server.to(data.sender).emit('newMessage', message);

  //   return message
  // }

  // channalMessage
  
  
  
  
  
  
  @SubscribeMessage('channelMessage')
  async channelMessage(
    @MessageBody() data: { 
      sender: string; 
      channel: string; 
      message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saveMessage = await this.channelService.createChannelMessage(data);
    this.server.to(data.channel).emit('channelMessage', saveMessage);
    // this.server.emit('channelMessage', saveMessage);
    return saveMessage;
  }



  // Join a specific channel room
  @SubscribeMessage('joinChannel')
  async joinChannel(@MessageBody() 
  data: { channel: string }, @ConnectedSocket() client: Socket) {
    client.join(data.channel);
  }
  
  // list messages for a channel
  @SubscribeMessage('listChannelMessages')
  async listChannelMessages(
    @MessageBody() data: { 
      channel: string;
      sender: string },
    @ConnectedSocket() client: Socket,
  ) {

    // console.log("channel", data.channel);
    // console.log("sender", data.sender);

      try {
        if (!data.channel || !data.sender) {
          // throw new Error('Channel not found');
          return;
        }
      const user = await this.prisma.user.findUnique({
        where: {
          username: data.sender,
        },
      });
      const channelId = await this.prisma.channel.findUnique({
        where: {
          name: data.channel,
          // userId: user.id,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }
 
      // list all messages for a channel
      const messages = await this.prisma.channel.findMany({
        where: {
          id: channelId.id,
        },
        include: {
          ChannelMessage: {
            include: {
              user: true,
            },
          },
        },
      });
    
      // save the messages in an array where ChannelMessage is an object with the message and user
      
      let msg = [];
      messages.forEach((element) => {
        element.ChannelMessage.forEach((el) => {
          msg.push(el);
        });
      }
      );

      // console.log("msg", msg);


      this.server.to(data.channel).emit('listChannelMessages', { msg });
      return msg;

    } catch (error) {
      console.error("Error while fetching messages:", error);
      throw error; // Rethrow the error to handle it in your calling code
    }
    
  }
  


  // saveChannelName to database
  @SubscribeMessage('saveChannelName')
  async saveChannelName(
    @MessageBody() data: {
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

    // let channel = [] ;
    // channel.push(saveChannel);
    // console.log("channel", channel);
    

    this.server.emit('saveChannelName', saveChannel);
    return saveChannel;
  }


  // get all channels
  @SubscribeMessage('listChannels')
  async listChannels(
    @MessageBody() data: { sender: string, channel: string },
    @ConnectedSocket() client: Socket,
  ) {
    
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.sender,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const channels = await this.prisma.channel.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    // console.log("channels", channels);
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
       include:{
        channel: true,
       }
      },
    );
    console.log("users", users);
    this.server.emit('getAllUsers', users);
    return users;
  }
}
