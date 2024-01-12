"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store";
import AIopponent from '@/components/AIopponent/AIopponent';
import FriendsList from '@/components/friendsList/friendsList';
import MatchHistory from '@/components/matchHistory/matchHistory';
import LeaderBoard from '@/components/leaderBoard/leaderBoard';
import ChallengeFriend from '@components/challengeFriend/challengeFriend';
import './dashboard.css'

export default function Dashboard() {
  const searchParams = useSearchParams();

  const userId = searchParams.get("id");
  const accessToken = searchParams.get("accesstoken");
  const isFirstLogin = searchParams.get("firstlogin");

  const fetchCurrentUser = useUserStore((state) => state.getUser);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (userId && isFirstLogin === "true") {
      window.location.href = `/settings`;
    }
  }, []);

  useEffect(() => {
    console.log("useEffect dashboard render....");
    fetchCurrentUser();
  }, []);

  if (userId && isFirstLogin === "true") {
    return <div>Redirecting...</div>;
  }
  return (
    <div className="p-8 flex justify-center items-center">
      <div className="dashboardGrid">
        <ChallengeFriend />
        <AIopponent />
        <MatchHistory />
        <LeaderBoard />
        <FriendsList />
      </div>
    </div>
  );
}
