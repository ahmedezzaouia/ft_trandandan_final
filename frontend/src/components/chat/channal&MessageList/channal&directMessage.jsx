"use client"

import CreateChannal from "../modelCreateChannal/createChannal";
import { useState } from "react";

export default function ChannalAndDirectMessage({user}  ) {

  
  const [directMessagePage, setDirectMessagePage] = useState(false);
  const [channalPage, setChannalPage] = useState(false);


  if (directMessagePage) {
    window.location.href = `/chat/${user?.id}/directMessage`;
  }
  if (channalPage) {
    window.location.href = `/chat/${user?.id}/channalMessage`;
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
                <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* channels  */}
      <div className="mb-8">
        <div className="px-4 mb-2 text-white flex justify-between items-center" >
          <div className="opacity-40 text-white font-thin shadow-lg ">Channels</div>
          <div>
            <CreateChannal />
          </div>
        </div>
        <div className="bg-teal-dark py-4 px-4 text-gray-400 font-bold  hover:bg-slate-700 hover:text-white hover:opacity-100 rounded-2xl cursor-pointer"
        onClick={() => setChannalPage(true)}>
          # general
        </div>
      </div>

      {/* direct messages */}
      
      <div className="mb-8">
        <div className="px-4 mb-2 text-white flex justify-between items-center">
          <span className="opacity-40 text-white font-thin shadow-lg 
          ">Direct Messages</span>
        </div>

        <div className="flex items-center py-2  hover:bg-slate-700 rounded-2xl cursor-pointer" onClick={() => setDirectMessagePage(true)}>
          <span className="relative flex h-1 w-3 ml-10 -mr-2  -mt-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
      <div className="flex items-center  w-12 h-12 mr-2 py5 " >
        <img
          src={user?.avatarUrl}
          alt=""
          className="rounded-3xl"
        />
        <span className="text-white font-bold  opacity-90 ml-5">
          {user?.username}
        </span>
        {/* list all users in database here insead of above*/} 
      </div>
          
        </div>
      </div>
    </div>
  );
}
