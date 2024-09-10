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
  const [hostStats, setHostStats] = useState("");
  const [peerStats, setPeerStats] = useState("");

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
  const handleHost = (stats) => {
    setHostStats(stats);
  };
  const handlePeer = (stats) => {
    setPeerStats(stats);
    console.log("setting peer stats");
  };
  console.log("peerStats：", peerStats);
  console.log("hostStats", hostStats);
  return (
    <div>
      <Outlet />
      <VideoChat
        onGameResult={handleGameResult}
        playerStats={playerStats}
        onRematch={handleRematch}
        rematch={rematch}
        onDisconnect={handleDisconnect}
        disconnected={disconnect}
        onResponse={handleResponse}
        onPeerStats={handlePeer}
        hostStats={hostStats}
        peerStats={peerStats}
      />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
          onDisconnect={handleDisconnect}
          onRematch={handleRematch}
          response={response}
          onHostStats={handleHost}
          peerStats={peerStats}
        />
      )}
    </div>
  );
};

export default ChatVideo;
