import React from 'react';
import  './AIopponent.css';

const AIopponent = () => (
  <div className='aiSection'>
    <img src="/pi2.png" alt="AI Opponent" className='image' />
    <div className='content'>
      <h3 className='title'>Face Our AI Opponent!</h3>
      <p className='description'>Challenge our AI opponent and test your ping pong skills</p>
      <button className='playButton'>Play</button>
    </div>
  </div>
);

export default AIopponent;
