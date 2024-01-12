import React from 'react';
import './challengeFriend.css';

const ChallengeFriend = () => (
  <div className="challengeFriend">
    <img src="/pic9.png" alt="Challenge a Friend" className="image" />
    <div className="content">
      <h3 className="title">Challenge a Friend!</h3>
      <p className="description">Play against a friend in a thrilling 1 vs 1 ping pong match</p>
      <button className="playButton">Play</button>
    </div>
  </div>
);

export default ChallengeFriend;