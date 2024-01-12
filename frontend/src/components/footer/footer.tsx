import React from 'react';
import Link from 'next/link';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <p className="text-xs text-gray-500 dark:text-gray-400">© ft_transcendence. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Privacy
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Contact
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
