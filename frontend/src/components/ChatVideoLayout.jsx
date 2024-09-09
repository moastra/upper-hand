import { Outlet } from "react-router-dom";
import VideoChat from "../VideoChat";
import React, { useState } from "react";
import Game from "./Game";

const ChatVideo = () => {
  const [gameResult, setGameResult] = useState("");
  const [playerStats, setPlayerStats] = useState({ player1: {}, player2: {} });
  const [rematch, setRematch] = useState(false);
  const [disconnect, setDisconnect] = useState(false);
  const [response, setResponse] = useState(false);

  const handleGameResult = (result) => {
    setGameResult(result);
    console.log(gameResult);
  };
  const handlePlayerStatsUpdate = (stats) => {
    setPlayerStats(stats);
  };
  const handleRematch = (boolean) => {
    setRematch(boolean);
  };
  const handleDisconnect = (boolean) => {
    setDisconnect(boolean);
  };
  const handleResponse = (boolean) => {
    setResponse(boolean);
  };
  return (
    <div>
      <h2>Chat Video Layout Componnents</h2>
      <Outlet />
      <VideoChat
        onGameResult={handleGameResult}
        playerStats={playerStats}
        onRematch={handleRematch}
        rematch={rematch}
        onDisconnect={handleDisconnect}
        disconnected={disconnect}
        onResponse={handleResponse}
      />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
          onDisconnect={handleDisconnect}
          onRematch={handleRematch}
          response={response}
        />
      )}
    </div>
  );
};

export default ChatVideo;
