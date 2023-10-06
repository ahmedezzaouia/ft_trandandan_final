"use client";
import socket from "@/services/socket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useUsernameStore from "@/store/usernameStore";

export default function AddFriends() {
  const { username, setUsername } = useUsernameStore();
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // Get the id of the user from the URL
  const params = useParams();
  const userId = params.id;

  const sendFriendRequest = async () => {
    try {
      // Fetch the username from session storage
      const storedUserData = sessionStorage.getItem("user-store");

      if (storedUserData) {
        // Parse the stored data as JSON
        const userData = JSON.parse(storedUserData);

        // Access the username property
        const savedUsername = userData.state.user?.username;

        // Set the username in the state
        setUsername(savedUsername);

        // Send friend request
        socket.emit("sendFriendRequest", {
          receiverInvite: userId,
          senderInvite: savedUsername,
        });

        // Emit notification
        socket.emit("notification", {
          username: savedUsername,
        });

        // Update the UI to show that the request has been sent
        setFriendRequestSent(true);

        console.log("Friend request sent successfully.");
      } else {
        console.warn("User data not found in session storage.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <>
      {!friendRequestSent ? (
        <button
          className="p-2 px-4 text-xs text-white font-bold w-32 bg-gray-500 border rounded-full shadow-lg"
          onClick={() => {
            sendFriendRequest();
          }}
        >
          Add Friend
        </button>
      ) : (
        <button
          className="max-w-xs p-2 px-4 text-xs cursor-pointer text-white font-bold bg-gray-500 border rounded-full shadow-lg"
          onClick={() => {
            sendFriendRequest();
          }}
          disabled
        >
          Pending
        </button>
      )}
    </>
  );
}
