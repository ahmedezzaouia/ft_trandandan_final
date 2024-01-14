"use client"
import React from 'react';
import Link from 'next/link';
import './heroSection.css';


const HeroSection: React.FC = () => {
  return (
    <section className='heroSection'>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className='welcomeTitle'>
              Welcome to ft_transcendence
            </h1>
            <p className='welcomeDescription'>
              The ultimate online multiplayer pong game. Experience the thrill of the classic arcade era in a modern,
              digital world.
            </p>
          </div>
          <div className='actionButtons'>
            <Link
              className="signUpButton"
              href="http://localhost:3001/auth/login"
            >
              Join Now
            </Link>
            <Link
              className="learnMoreButton"
              href="#"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
