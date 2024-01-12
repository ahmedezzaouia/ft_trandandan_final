import React from 'react';
import Link from 'next/link';
import './communitySection.css';

const CommunitySection: React.FC = () => {
  return (
    <section className='communitySection'>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className='communityTitle'>
              Join the ft_transcendence community
            </h2>
            <p className='communityDescription'>
              Be a part of the gaming revolution. Join the ft_transcendence community and experience the thrill of the
              game like never before.
            </p>
          </div>
          <div className="communityButtons">
            <Link
              className="linkSignUpNow"
              href="#"
            >
              Sign Up Now
            </Link>
            <Link
              className="linkLearnMore"
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

export default CommunitySection;
