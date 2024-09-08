import React, { useState } from "react";
// import Video from "./Video";
// import PeerChat from "./PeerChat";
import VideoChat from "./VideoChat";
import LobbyChat from "./LobbyChat";
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
    <div className="App">
      <LobbyChat />
      <VideoChat onGameResult={handleGameResult} playerStats={playerStats} />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
        />
      )}
      {/* <Chat /> */}
      {/* <Video /> */}
      {/* <PeerChat /> */}
    {/* <div>
      <Video onGameResult={handleGameResult} playerStats={playerStats} />
      {gameResult && (
        <Game
          initialGameResult={gameResult}
          onPlayerStatsUpdate={handlePlayerStatsUpdate}
        />
      )}
    </div> */}
    </div>
  );
};

// function App() {
//   return (
//     <div className="App">
//       <Chat />
//     </div>
//   );
// }

export default App;
