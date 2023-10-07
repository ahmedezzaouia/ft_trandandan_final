import socket from "@/services/socket";
import { useEffect, useState } from "react";
import  {useIsDirectMessage}  from "@/store/userStore";
import  useRecieverStore  from "@/store/recieverStore";
import useMessageStore from "@/store/messagesStore";
import { fetchUser } from "@/services";

export default function ListUsersFriends({ username } : { username: any}) {
  // request to get all users
  const [users, setUsers] = useState([]);
  const {isDirectMessage, setIsDirectMessage} = useIsDirectMessage();
  const { reciever, setReciever } = useRecieverStore();
  const {messages, setMessages } = useMessageStore();
  const [friendsId, setFriendsId] = useState([]);
  const [UserName, setUserName] = useState("");



// fetch username from session storage
const fetchUserName = async () => {
  const storedUserData = sessionStorage.getItem("user-store");
  if (storedUserData) {
    try {
      // Parse the stored data as JSON
      const userData = await JSON.parse(storedUserData);

      // Access the username property
      const savedUsername = userData.state.user.username;

      setUserName(savedUsername);
    } catch (error) {
      console.error("Error parsing stored data:", error);
    }
  } else {
    console.warn("User data not found in session storage.");
  }
};

  // Define a function to copy users to friendsArray

// Define a function to compare friendsId with all users id
const comparingFriends = () => {
  socket.emit("getAllUsersFriends", {sender: username});
  socket.on("getAllUsersFriends", (data) => {
    // console.log("data", data);
    let friendsArray = [...data.map((user : any) => user.receiverId)];
    setFriendsId(friendsArray as any);
    // console.log("friendsArray2", friendsArray);
  }
  );
};

// Define a function to get real friends by id
const getRealFriendsById = () => {
  if (friendsId.length > 0) {
    friendsId.map((friendId : any) => {
      socket.emit("getUserById", {id: friendId});
      socket.on("getUserById", (data) => {
        let newArray = [];
        newArray = [...users, data];
        if (newArray.length > 0) {
          newArray = newArray.filter((user : any) => user.username !== username);  // remove yourself from the list
          // avoid duplicate users
          newArray = newArray.filter((user : any, index : any, self : any) =>
            index === self.findIndex((t : any) => (
              t.username === user.username
            ))
          );
        }
        setUsers(newArray as any);
      });
    });
  }
}



// get all users
useEffect(() => {
  socket.emit("getAllUsers");
  socket.on("getAllUsers", (data) => {
    // Filter out duplicate users based on username
    const uniqueUsers = data.filter((user : any) => user.username !== username);
    // console.log("users", uniqueUsers);
    let newArray = [];
    newArray = uniqueUsers.filter((user : any)  => user.username !== username);
    setUsers(newArray);
  });

  return () => {
    // Clean up any event listeners or subscriptions
    socket.off("getAllUsers");
  };
}, []);



// Use useEffect with users as a dependency to trigger the copy operation
useEffect(() => {
  fetchUserName();
  comparingFriends();
  getRealFriendsById();
}, [
  users, friendsId
]);



  // save the reciever name
  const saveReceiverName = (username: string) => {
    setReciever(username);
    setIsDirectMessage(true);
    socket.emit("listDirectMessages", { sender: username, reciever: reciever });
    socket.on("listDirectMessages", (data) => {
      setMessages(data);
      console.log(data);
    });
  };

  let usersArray = [...users];

  return (
    <>
      {usersArray.map((user : any, index) => (
        <div
          className="flex items-center py-2  hover:bg-slate-700 rounded-2xl cursor-pointer"
          key={index}
        >
          <span className="relative flex h-1 w-3 ml-10 mr-3  -mt-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
          <div
            className="flex flex-col items-center  w-16 h-16 mr-2"
            onClick={() => saveReceiverName(user.username)}
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
                <span className="font-semibold text-md"
                >{user.username}</span>
                <span className="text-sm text-gray-400">online</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
