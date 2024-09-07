import React, { useState } from "react";
import Chat from "./Chat";
import Video from "./Video";
import Game from "./components/Game";

const App = () => {
  const [gameResult, setGameResult] = useState(null);

  const handleGameResult = (result) => {
    setGameResult(result);
  };
  console.log("game result from app:", gameResult);
  return (
    <div>
      <Video onGameResult={handleGameResult} />
      {gameResult && <Game initialGameResult={gameResult} />}
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
