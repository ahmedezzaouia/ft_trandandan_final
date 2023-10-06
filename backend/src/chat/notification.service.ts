import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class notificationService {
    constructor (private readonly prisma: PrismaService) {}

    // ------------------ add friend ------------------
    async addFriend(data: { reciverInvite : string, senderIvite : string }) {
        // console.log("----------------",data.reciverInvite)

        try{
            const senderUser = await this.prisma.user.findUnique({
                where: {
                    username: data.senderIvite,
                },
            });
            // console.log("senderUser",senderUser)

            const reciverUser = await this.prisma.user.findUnique({
                where: {
                    id: data.reciverInvite,
                },
            });

            // console.log("reciverUser",reciverUser)
            // check if the user is already send a friend request
            const friendRequest = await this.prisma.friendRequest.findFirst({
                where: {
                    senderId: senderUser.id,
                    receiverId: reciverUser.id,
                },
            });
            if (friendRequest) {
                // console.log("friendRequest alredy exist",friendRequest)
                return friendRequest;
            }

            const friend = await this.prisma.friendRequest.create({
                data: {
                    senderId: senderUser.id,
                    receiverId: reciverUser.id,
                    status: "pending",
                },
            });

            // console.log("friend",friend)

            return friend;
            

        }
        catch(err){
            throw err;
        }
        
    }


    // ------------------ list notification ------------------
    async listFriendRequest(data: { username : string }) {
        try{
            const user = await this.prisma.user.findUnique({
                where: {
                    username: data.username,
                },
                include: {
                    senderRequests: {
                        include: {
                            senderRequests: true,
                        },
                    },
                    receiverRequests: {
                        include: {
                            receiverRequests: true,
                        },
                    },
                },
            });
            console.log("user",user)
            return user;
        }
        catch(err){
            throw err;
        }
        
    }
}