"use client";
import "./chat.css";
import React from "react";
import ChannalAndDirectMessage from "@/components/chat/channal&MessageList/channal&directMessage";
import ChatContent from "@/components/chat/chatContent/chatContent";
import AdminsMembers from "@/components/chat/adminMembers/adminMembers";

import { useParams } from "next/navigation";
import { fetchUser } from "@/services/userServices";
import useSWR from "swr";
import { useState } from "react";
import { useChannelStore } from "@/store/userStore";
import { userNameStore } from "@/store/userStore";
import { directMessageStore } from "@/store/userStore";

// just a variable to check if the message is a direct message or not

export default function DirectMessage() {
  // Use the Zustand store to get and update the channel state
  const channel = useChannelStore((state) => state.channel);
  const setChannel = useChannelStore((state) => state.setChannel);

  // use the Zustand store to get and update the username state
  const setUsername = userNameStore((state) => state.setUsername);
  const username = userNameStore((state) => state.username);

  // use the Zustand store to get and update the directMessage state
  const setDirectMessage = directMessageStore((state) => state.setDirectMessage);
  const directMessage = directMessageStore((state) => state.directMessage);

  const params = useParams();
  const userId = params.id;
  const { data: user, error } = useSWR(
    `http://localhost:3001/user/${userId}`,
    fetchUser
  );
  
  return (
    <div className="chat-container">
      <div className="flex h-full">
        <ChannalAndDirectMessage
          user={user}
          channel={channel}
          setChannel={setChannel}
          username={username}
          setUsername={setUsername}
          directMessage={directMessage}
          setDirectMessage={setDirectMessage}
        />
        <ChatContent
          user={user}
          channel={channel}
          setChannel={setChannel}
          username={username}
          setUsername={setUsername}
          directMessage={directMessage}
          setDirectMessage={setDirectMessage}
        />
        <AdminsMembers user={user} />
      </div>
    </div>
  );
}
