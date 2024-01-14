"use client"

import React from 'react';
import './featureSection.css';

const FeatureSection: React.FC = () => {
  return (
    <section className='featuresSection'>
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="featureTag">
              New Features
            </div>
            <h2 className='featureTitle'>
              Experience the thrill of the game
            </h2>
            <p className='featureDescription'>
              Dive into the world of ft_transcendence and experience the thrill of the classic pong game with a modern
              twist. With seamless multiplayer experience and endless customization possibilities, ft_transcendence is
              not just a game, it's a revolution.
            </p>
          </div>
          <div className="featureImage">
            <img
              alt="Image"
              src="./cap.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
