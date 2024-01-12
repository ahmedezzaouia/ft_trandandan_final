import React from 'react';
import './scores.css'

interface ScoreProps {
  leftScore: number;
  rightScore: number;
}

const Score: React.FC<ScoreProps> = ({ leftScore, rightScore }) => {
  return (
    <div className="score-bar">
      <div className="left-score">{leftScore}</div>
      <div className="right-score">{rightScore}</div>
    </div>
  );
};

export default Score;
