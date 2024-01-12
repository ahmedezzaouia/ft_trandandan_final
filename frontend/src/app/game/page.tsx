"use client"
// Import statements...
import { Socket } from 'socket.io'
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Ball from '@/components/ball/ball';
import Bar from '@/components/gamebar/gamebar';
import MapSelection from "@/components/MapSelection/MapSelection";
import WaitStage from '@/components/waitStage/waitStage';
import Score from '@/components/scores/scores';
import './game.css';
import { useUserStore } from '@/store';
import { User } from '@/types';
import { useStore } from 'zustand';

const socket:Socket = io("http://localhost:3001");
// const user:User | null = useUserStore((state) => state.user);
const user:User | null = useUserStore.getState().user;

const HomePage: React.FC = () => {
// export default function HomePage() {
  // const currentuser = JSON.parse(sessionStorage.getItem("user-store"));
  // const user = currentuser.;
  const [isGameStarted, setGameStarted] = useState(false);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [player1Position, setplayer1Position] = useState({ x: 0, y: 400 });
  const [player2Position, setplayer2Position] = useState({ x: 1390, y: 400 });
  const [players, setStr2] = useState<any>({
    user1: {
      x : 0,
      y : 0,
      score : 0
    },
    user2: {
        x : 0,
        y : 0,
        score : 0
    },
    ball : {
        x: 0,
        y: 0
    },
    delay: 0
  });

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isPlayer1Joined, setPlayer1Joined] = useState(false);
  const [isPlayer2Joined, setPlayer2Joined] = useState(false);
  const [delaystat, setdelaystat] = useState(false);
  let [string, setstr] = useState<any>("haha");
  interface map {
    id: number;
    name: string;
    imageUrl?: string;
  }

  const maps: map[] = [
    { id: 1, name: 'Map 1', imageUrl: '/img1.jpg' },
    { id: 2, name: 'Map 2', imageUrl: '/img2.jpg' },
    { id: 3, name: 'Map 3', imageUrl: '/img3.jpg' },
    { id: 4, name: 'Map 4', imageUrl: '/img4.jpg' },
    { id: 5, name: 'Map 5', imageUrl: '/img5.webp' },
    { id: 0, name: 'Default' },
  ];

  const resetGame = () => {
    setSelectedMap(null);
    setGameStarted(false);
  };

  const handleSelectMap = (mapId: string | null) => {
    setSelectedMap(mapId);
  };

  const handleStartGame = () => {
    if (selectedMap !== null) {
      setGameStarted(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetGame();
      }
    };
    if (string != "you can play"){
      socket.emit('AddUserToRoom', user);
      const queuehundler = (str: string) => {
        setstr(str);
      }
      socket.on('wait', queuehundler);
    }
    if (string == "you can play"){
      setPlayer1Joined(true);
      setPlayer2Joined(true);
      const hundler = (init : any) => {
        setStr2(init);
      };
      socket.on('userposition', hundler);
      const move = (evt: any) => {
        let pos = evt.clientY - 100;
        socket.emit('dataofmouse', pos);
      }
      window.addEventListener("mousemove", move);
      const ballposition = {x: players.ball.x, y: players.ball.y};
      const player1position = {x: players.user1.x, y: players.user1.y};
      const player2position = {x: players.user2.x, y: players.user2.y};
      if (players.delay)
        setdelaystat(true);
      setBallPosition(ballposition);
      setplayer1Position(player1position);
      setplayer2Position(player2position);
      setPlayer1Score(players.user1.score);
      setPlayer2Score(players.user2.score);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener("mousemove", move);
        socket.off('userposition', hundler);
      };
    }
    else
      string += 'a';
  }, [players, string]);

  return (
    <div>
      <Head>{/* ... */}</Head>
      <main className="page">
        <div className="square">
          {!isGameStarted ? (
            <MapSelection
              maps={maps}
              onSelectMap={handleSelectMap}
              onStartGame={handleStartGame}
            />
          ) : (
            <div className="gameArea" style={{ backgroundImage: selectedMap ? `url(${maps.find((map) => map.id.toString() === selectedMap)?.imageUrl})` : 'none' }}>
                {isPlayer1Joined && isPlayer2Joined ? (
                <>
                  <Score leftScore={player1Score} rightScore={player2Score} />
                  <Ball x={ballPosition.x} y={ballPosition.y} />
                  <Bar position={player1Position} left={true} />
                  <Bar position={player2Position} left={false} />
                  {/* <Delay stat={players.delay}/> */}
                  <div className="verticalLine"></div>
                </>
              ) : (
                <WaitStage />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
