"use client";

import CreateChannal from "../modelCreateChannal/createChannal";
import { useEffect, useState } from "react";
import socket from "@/services/socket";
import ListUsersFriends from "./listUsersFriends/listUsersFriends";

export default function ChannalAndDirectMessage({
  user,
  channel,
  setChannel,
  directMessage,
  setDirectMessage,
}) {
  const [channalPage, setChannalPage] = useState(false);
  const [channels, setChannels] = useState([]);
  const [username, setUsername] = useState("");
  const [nameUser, setNameUser] = useState("");
  // This function will be passed as a prop to Child1
  const addChannel = (channelName) => {
    // Add the new channel name to the existing list of channels
    setChannels([...channels, channelName]);
    if (channels !== []) {
      socket.emit("saveChannelName", {
        channel: channelName,
        sender: username,
      });
    }
  };

  // todo add this to costum hook

  useEffect(() => {
    // Search for the username and set it in the state
    async function fetchUsername() {
      const storedUserData = sessionStorage.getItem("user-store");
      if (storedUserData) {
        try {
          // Parse the stored data as JSON
          const userData = await JSON.parse(storedUserData);

          // Access the username property
          const saveusername = userData.state.user.username;

          setUsername(saveusername);
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      } else {
        console.warn("User data not found in session storage.");
      }
    }

    fetchUsername(); // Fetch the username

    // Return a cleanup function if needed (e.g., to unsubscribe from listeners)
    return () => {
      // Clean up any event listeners or subscriptions
    };
  }, []); // Empty dependency array to run this effect only once

  // get all channels
  useEffect(() => {
    if (username !== "") {
      socket.emit("listChannels", {
        sender: username,
        channel: channels,
      });

      // data returned from server as array of objects
      socket.on("listChannels", (data) => {
        if (data[0]?.user.username !== username) return;
        data.map((channel) => {
          if (channel.name === "general") return;
          setChannels((prevChannels) => [...prevChannels, channel.name]);
        });
      });
    }
  }, [username]);

  function switchChannelName(channelName) {
    setDirectMessage(false);
    console.log("directMessage2", directMessage);
    setChannel(channelName);
    console.log("saving channel name channlelist", channel);
  }

  // todo to pass channel name to chatContent you need to use global state

  if (directMessage) {
    // window.location.href = `/chat/${user?.id}/channalMessage`;
    // to avoid reload page we will use another way
    // setNameUser(user?.username);
  }
  if (channalPage) {
    // window.location.href = `/chat/${user?.id}/channalMessage`;
  }
  function setChannalPageAndSavedefaultName() {
    setChannalPage(!channalPage);
    setChannel("general");
    setDirectMessage(false);
  }


  return (
    <div className="list-div bg-slate-900 mr-10 ml-10 text-purple-lighter  w-80  hidden lg:block rounded-2xl overflow-hidden border border-gray-800">
      {/* <!-- Sidebar Header --> */}
      <div className="text-white mb-2 mt-3 px-4  flex justify-between">
        <div className="flex-auto ">
          <div className="flex items-center justify-between">
            <hr />
            <span>
              <svg
                className="w-6 h-6 text-whote opacity-75 dark:text-white cursor-pointer "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                channels
                <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* channels  */}
      <div className="mb-8">
        <div className="px-4 mb-2 text-white flex justify-between items-center">
          <div className="opacity-40 text-white font-thin shadow-lg ">
            Channels
          </div>
          <div>
            <CreateChannal addChannel={addChannel} />
          </div>
        </div>
        <div
          className="bg-teal-dark py-4 px-4 text-gray-400 font-bold  hover:bg-slate-700 hover:text-white hover:opacity-100 rounded-2xl cursor-pointer"
          onClick={() => setChannalPageAndSavedefaultName()}
        >
          # general
        </div>
        <ul>
          {channels.map((channelName, index) => (
            // onclick list all messages in this channel

            <li
              className="bg-teal-dark py-4 px-4 text-gray-400 font-bold  hover:bg-slate-700 hover:text-white hover:opacity-100 rounded-2xl cursor-pointer"
              key={index}
              onClick={() => switchChannelName(channelName)}
            >
              # {channelName}
            </li>
          ))}
        </ul>
      </div>

      {/* direct messages */}

      <div className="mb-8">
        <div className="px-4 mb-2 text-white flex justify-between items-center">
          <span
            className="opacity-40 text-white font-thin shadow-lg 
          "
          >
            Direct Messages
          </span>
        </div>
            <ListUsersFriends
              username={username}
              directMessage={directMessage}
              setDirectMessage={setDirectMessage}
            />
            {/* list all users in database here insead of above*/}
          </div>
        </div>
  );
}
