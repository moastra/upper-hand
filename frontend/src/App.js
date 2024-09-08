import React, { useState } from "react";
import Chat from "./Chat";
import Video from "./Video";
import Game from "./components/Game";

const App = () => {
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
      <Video onGameResult={handleGameResult} playerStats={playerStats} />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
        />
      )}
    </div>
  );
};

export default App;
