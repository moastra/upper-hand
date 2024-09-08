import { Outlet } from 'react-router-dom'
import VideoChat from '../VideoChat';
import React, { useState } from 'react';
import Game from "./Game";

const ChatVideo = () => {
  const [gameResult, setGameResult] = useState("");
  const [playerStats, setPlayerStats] = useState({ player1: {}, player2: {} });

  const handleGameResult = (result) => {
    setGameResult(result);
    console.log(gameResult);
  };
  const handlePlayerStatsUpdate = (stats) => {
    setPlayerStats(stats);
  };

  
  return (
    <div>
      <h2>Chat Video Layout Componnents</h2>
      <Outlet />
      <VideoChat onGameResult={handleGameResult} playerStats={playerStats} />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
        />
      )}

    </div>
  );
};

export default ChatVideo;
