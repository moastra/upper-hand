import React, { useEffect, useState } from "react";
import Player from "./Player";
const initialPlayerState = {
  name: "Player 1",
  hp: 100,
  attack: 20,
  defense: 10,
  choice: null, // Added choice field
};

const Game = ({ initialGameResult }) => {
  console.log("Initial Game Result received:", initialGameResult);
  const [player1, setPlayer1] = useState(initialPlayerState);
  const [player2, setPlayer2] = useState({
    ...initialPlayerState,
    name: "Player 2",
  });
  const [roundResult, setRoundResult] = useState(null);

  useEffect(() => {
    if (initialGameResult) {
      const { local, remote, result } = initialGameResult;
      if (result === "Win") {
        // Player 1 wins, decrease Player 2's HP
        setPlayer2((prev) => ({
          ...prev,
          hp: Math.max(prev.hp - player1.attack, 0),
        }));
      } else if (result === "Lose") {
        // Player 2 wins, decrease Player 1's HP
        setPlayer1((prev) => ({
          ...prev,
          hp: Math.max(prev.hp - player2.attack, 0),
        }));
      }
      setPlayer1((prev) => ({ ...prev, choice: null }));
      setPlayer2((prev) => ({ ...prev, choice: null }));
      setRoundResult(result);
    } else {
      setRoundResult("Both players need to make a choice.");
      return;
    }
  }, [initialGameResult]);

  return (
    <div>
      <Player player={player1} />
      <Player player={player2} />
      {roundResult && <p>Round Result: {roundResult}</p>}
    </div>
  );
};

export default Game;
