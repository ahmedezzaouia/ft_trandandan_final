import socket from "@/services/socket";
import { useEffect, useState } from "react";

export default function ListUsersFriends({ username, directMessage, setDirectMessage }) {
  

  // request to get all users
  const [users, setUsers] = useState([]);

  // get all users
  useEffect(() => {
    socket.emit("getAllUsers");
    socket.on("getAllUsers", (data) => {
        setUsers(data); 
    });
  }, []);

  let newArray = [];
  newArray = users.filter((user) => user.username !== username);


  return (
    <>
      {newArray.map((user, index) => (
        <div
          className="flex items-center py-2  hover:bg-slate-700 rounded-2xl cursor-pointer"
        >
          <span className="relative flex h-1 w-3 ml-10 mr-3  -mt-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
          <div
            className="flex flex-col items-center  w-16 h-16 mr-2"
            onClick={() => setDirectMessage(true)}
          >
            <div
              className="flex items-center p-2 space-x-4  cursor-pointer rounded-xl"
              key={index}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={user.avatarUrl}
                alt="avatar"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-md">{user.username}</span>
                <span className="text-sm text-gray-400">online</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
