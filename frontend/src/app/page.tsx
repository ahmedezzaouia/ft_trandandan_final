"use client";
// import 'flowbite'
import React from "react";
import Head from 'next/head';
import HeroSection from '@/components/heroSection/heroSection' ;
import FeaturesSection from '@/components/featureSection/featureSection';
import CommunitySection from '@/components/communitySection/communitySection';
import Footer from '@/components/footer/footer';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>ft_transcendence</title>
        <meta name="description" content="Join the ultimate online multiplayer pong game" />
      </Head>

      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <Footer />
    </>
  );
};

