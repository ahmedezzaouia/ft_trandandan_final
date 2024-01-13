"use client"
// Import statements...
import { Socket } from 'socket.io'
import { io } from 'socket.io-client';
import React, { useRef, useState, useEffect } from 'react';
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
const user:User | null = useUserStore.getState().user;

const HomePage: React.FC = () => {
  const cvsRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
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
  const net = {
    x: 0,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE",
  };

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
    const cvs = cvsRef.current;
    const ctx = cvs?.getContext("2d");
    
    ctxRef.current = ctx;
    
    if (!cvs || !ctx) return;
    const drawNet = () => {
      for (let i = 0; i <= cvs.height; i += 15) {
        drawrect(cvs.width / 2 - 1, net.y + i, net.width, net.height, net.color);
      }
    };
    
    const drawrect = (x: number, y: number, w: number, h: number, color: string) => {
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      }
    };
    
    const drawcircle = (x: number, y: number, r: number, color: string) => {
      if (ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
      }
    };
    
    const drawtext = (text: any, x: number, y: number, color: string, font: string) => {
      if (ctx) {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text.toString(), x, y);
      }
    };
    if (string != "you can play"){
      socket.emit('AddUserToRoom', user);
      const queuehundler = (str: string) => {
        setstr(str);
      }
      socket.on('wait', queuehundler);
      drawrect(0, 0, cvs.width, cvs.height, "BLACK");
      drawtext("WAIT FOR OTHER PLAYER", cvs.width / 3, cvs.height / 2, "WHITE", "50px fantasy");
    }
    if (string == "you can play"){
      const hundler = (init : any) => {
        setStr2(init);
      };
      
      socket.on('userposition', hundler);


      const move = (evt: any) => {
        let rect = cvs.getBoundingClientRect();
        
        let pos = evt.clientY - rect.top - 100;
        socket.emit('dataofmouse', pos);
      }

      cvs.addEventListener("mousemove", move);
      setPlayer1Score(players.user1.score);
      setPlayer2Score(players.user2.score);
      drawrect(0, 0, cvs.width, cvs.height, "BLACK");
      drawNet();
      
      drawtext(players.user1.score, cvs.width / 4, cvs.height / 5, "WHITE", "50px fantasy");
      drawtext(players.user2.score, (3 * cvs.width) / 4, cvs.height / 5, "WHITE", "50px fantasy");
      
      drawrect(players.user1.x, players.user1.y, 10, 200, "WHITE");
      drawrect(players.user2.x, players.user2.y, 10, 200, "WHITE");
      
      drawcircle(players.ball.x, players.ball.y, 15, "WHITE");
      if (players.delay)
        drawtext(players.delay, cvs.width / 2.5 , 2 * cvs.height / 3, "WHITE", "500px fantasy");
      if (players.user1.status || players.user2.status){
        let user;
        if (players.user1.socket == socket.id)
          user = players.user1;
        else
          user = players.user2;
        if (user.status)
          drawtext("YOU WON", cvs.width / 3 , cvs.height / 2, "WHITE", "100px fantasy");
        else
          drawtext("YOU LOST", cvs.width / 3 , cvs.height / 2, "WHITE", "100px fantasy");
      }

      return () => {
        socket.off('userposition', hundler);
        cvs.removeEventListener("mousemove", move);
        };
    }
  }, [players, string]);

  return (
    <div>
      <Head>{/* ... */}</Head>
      <main className="page">
        <div className="square">
          <canvas className="canvas-container" width="1400" height="800" ref={cvsRef} ></canvas>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
