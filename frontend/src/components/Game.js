import React, { useEffect, useState } from "react";
import Player from "./Player";

const initialPlayerState = {
  name: "Player 1",
  hp: 100,
  attack: 20,
  defense: 10,
};

const Game = ({ initialGameResult, onPlayerStatsUpdate }) => {
  const [player1, setPlayer1] = useState(initialPlayerState);
  const [player2, setPlayer2] = useState({
    ...initialPlayerState,
    name: "Player 2",
  });

  // Effect to handle game result and update players' HP
  useEffect(() => {
    if (initialGameResult) {
      const { local, remote, result } = initialGameResult;

      // Use functional state updates to ensure accurate state changes
      setPlayer2((prev) => {
        const newHp =
          result === "Win"
            ? Math.max(prev.hp - (player1.attack - player2.defense), 0)
            : prev.hp;

        return { ...prev, hp: newHp };
      });

      setPlayer1((prev) => {
        const newHp =
          result === "Lose"
            ? Math.max(prev.hp - (player2.attack - player1.defense), 0)
            : prev.hp;

        return { ...prev, hp: newHp };
      });
    }
  }, [initialGameResult]);

  // Effect to notify parent component of updated player stats
  useEffect(() => {
    onPlayerStatsUpdate({
      player1: { ...player1 },
      player2: { ...player2 },
    });
  }, [player1.hp, player2.hp, onPlayerStatsUpdate]);

  return (
    <div>
      <Player player={player1} />
      <Player player={player2} />
    </div>
  );
};

export default Game;
