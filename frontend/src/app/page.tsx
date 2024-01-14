"use client";
// import 'flowbite'
import React from "react";
import Head from 'next/head';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>ft_transcendence</title>
        <meta name="description" content="Join the ultimate online multiplayer pong game" />
      </Head>

      <div className="btn"><a href="http://localhost:3001/auth/login">Play Now</a></div>
    </>
  );
};

