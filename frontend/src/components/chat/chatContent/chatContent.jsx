"use client";
import "./chatContent.css";

import TopBar from "./topbar/topbar";

import {  use, useEffect } from "react";
import io from "socket.io-client";
import { useState } from "react";
import { data } from "autoprefixer";



export default function ChatContent({ user, directMessage }) {
  const socket = io("http://localhost:3001"); // Replace with your backend server URL
  console.log("Socket connection established");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState(""); // State for input field
  // const [isChannel, setIsChannel] = useState(false);
  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState("general"); // Default channel //todo channel will be global state
  const [senderMessages, setSenderMessages] = useState([]);
  const [recieverMessages, setRecieverMessages] = useState([]);
  const [avaterUser, setAvaterUser] = useState("");
  const [NameUser, setNameUser] = useState("");
  const [avaterReciever, setAvaterReciever] = useState("");



  const sendMessage = () => {
    // if (messageInput === "") return;
    // Send the message input to the server
    // isChannel ?
    socket.emit("channelMessage", {
      sender: user.username,
      channel:  channel,
      message: messageInput,
      // }) :
      // socket.emit("directMessage", {
      //   sender: user.username,
      //   message: messageInput,
    });
    setMessageInput("");
    // Clear the input field after sending the message

    // save the message in the state
    if (messageInput === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: user.username, channel: channel, message: messageInput },
    ]);
  };

  useEffect(() => {
    
    // Search for the username and set it in the state
    async function fetchUsername() {
      const storedUserData = sessionStorage.getItem('user-store');
      if (storedUserData) {
        try {
          // Parse the stored data as JSON
          const userData = await JSON.parse(storedUserData);
  
          // Access the username property
          const saveusername = userData.state.user.username;
  
          setUsername(saveusername);
        } catch (error) {
          console.error('Error parsing stored data:', error);
        }
      } else {
        console.warn('User data not found in session storage.');
      }
    }
  
    fetchUsername(); // Fetch the username
  
    // Return a cleanup function if needed (e.g., to unsubscribe from listeners)
    return () => {
      // Clean up any event listeners or subscriptions
    };
  }, []); // Empty dependency array to run this effect only once
  


  useEffect(() => {
    // Check if username is defined and the channel is set
    
    if (username) {
      // Join the channel
      socket.emit('joinChannel', { channel: channel });
      
      // Send event to get all messages from the channel
      socket.emit("listChannelMessages", {
        sender: username,
        channel: channel,
      });
      
      // List all messages from the channel
      socket.on("listChannelMessages", (data) => {
        // Check if data.msg is an array before mapping
        if (username === data.msg[0].user.username) {
          if (Array.isArray(data.msg)) {
            // Update your state with the messages
            if (data.msg.length === 0) {
              sconsole.log("no messages");
              return;
            }
            console.log("data.msg", data.msg);
            // setMessages(data.msg);
            setSenderMessages(data.msg);
            setAvaterUser(data.msg[0].user.avatarUrl);
            setNameUser(data.msg[0].user.username);
          } else {
            console.error("Received data.msg is not an array:", data.msg);
          }
        }
        else {
          if (Array.isArray(data.msg)) {
            // Update your state with the messages
            if (data.msg.length === 0) {
              sconsole.log("no messages");
              return;
            }
            console.log("data.msg", data.msg);
            setRecieverMessages(data.msg);
            setAvaterReciever(data.msg[0].user.avatarUrl);
            setNameUser(data.msg[0].user.username);
          } else {
            console.error("Received data.msg is not an array:", data.msg);
          }
        }
      });
  
      return () => {
        // Clean up event listeners or subscriptions related to this channel
        socket.off("listChannelMessages");
      };
    }
    console.log(username)
    // print sender 
    
  }, [username, channel, messageInput]); // Re-run this effect when the username or channel changes
  



  
  return (
    <div className=" chat-content flex-1 flex flex-col overflow-hidden rounded-3xl shadow border border-gray-800 lg:max-w-screen-md">
      {/* <!-- Top bar --> */}
      <TopBar user={user} directMessage={directMessage} />

      {/* <!-- Chat direct messages --> */}
      {directMessage !== "directMessage" ? (
        <div className=" p-14 flex-1 overflow-auto">
          {/* <!-- A sender message --> */}
          <div className="flex items-start mb-4 text-sm">
            <img
              src={avaterUser}
              className="w-10 h-10 rounded-full mr-3"
              />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between">
                <span className="font-bold text-white">{NameUser}</span>
                <span className="text-grey text-xs">12:45</span>
              </div>
              <p className="text-white leading-normal">
                How are you doing joey?
              </p>
              <p className="text-white leading-normal">
                
                {messages.map((message, index) => (
                  <p key={index}>{message.text}</p>
                ))}
              </p>
            </div>
          </div>
          {/* <!-- A response message --> */}
        </div>
      ) : (
        // channel messages
        <div className=" p-14 flex-1 overflow-auto">
          <div className="flex flex-col mb-4 text-sm">
                 {senderMessages.map((message, index) => (
              <>
                <div className="flex items-center">
                  <img
                    src={message.user.avatarUrl}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-bold text-white">{message.user.username}</span>
                </div>
                <p className="text-white font-sans px-14" key={index}>
                    <span className="text-white font-sans " key={index}>
                      {message.message}
                    </span>
                </p>
              </>
            ))}
            {recieverMessages.map((message, index) => (
              <>
                <div className="flex items-center">
                  <img
                    src={message.user.avatarUrl}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-bold text-white">{message.user.username}</span>
                </div>
                <p className="text-white font-sans px-14" key={index}>
                    <span className="text-white font-sans " key={index}>
                      {message.message}
                    </span>
                </p>
              </>
            ))  
            }
          </div>
        </div>
      )}

      {/* <!-- Chat input --> */}
      <div className="pb-6 px-4 flex-none">
        <div className="flex rounded-3xl  overflow-hidden ml-20 mr-20">
          <input
            type="text"
            spellCheck="false"
            className="w-full border-none px-4 bg-slate-800  "
            placeholder="Write your Message "
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <span className="text-3xl text-grey p-2 bg-slate-800">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current h-6 w-6 block bg-slate-800 cursor-pointer hover:text-white"
              onClick={sendMessage}
            >
              <path
                d="M11.361 9.94977L3.82898 11.2058C3.74238 11.2202 3.66112 11.2572 3.59336 11.313C3.5256 11.3689 3.47374 11.4415 3.44298 11.5238L0.845978 18.4808C0.597978 19.1208 1.26698 19.7308 1.88098 19.4238L19.881 10.4238C20.0057 10.3615 20.1105 10.2658 20.1838 10.1472C20.2571 10.0287 20.2959 9.89212 20.2959 9.75277C20.2959 9.61342 20.2571 9.47682 20.1838 9.3583C20.1105 9.23978 20.0057 9.14402 19.881 9.08177L1.88098 0.0817693C1.26698 -0.225231 0.597978 0.385769 0.845978 1.02477L3.44398 7.98177C3.47459 8.06418 3.5264 8.13707 3.59417 8.19307C3.66193 8.24908 3.74327 8.28623 3.82998 8.30077L11.362 9.55577C11.4083 9.56389 11.4503 9.58809 11.4806 9.62413C11.5109 9.66016 11.5275 9.70571 11.5275 9.75277C11.5275 9.79983 11.5109 9.84538 11.4806 9.88141C11.4503 9.91745 11.4083 9.94165 11.362 9.94977H11.361Z"
                fill="#8BABD8"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
