import React, { useEffect, useState, useCallback } from "react";
import Player from "./Player";
import { checkPatterns } from "../utility/roundpattern";

const initialPlayerState = {
  name: "Player 1",
  hp: 300,
  attack: 10,
  defense: 5,
};

const Game = ({ initialGameResult, onPlayerStatsUpdate }) => {
  const [player1, setPlayer1] = useState(initialPlayerState);
  const [player2, setPlayer2] = useState({
    ...initialPlayerState,
    name: "Player 2",
  });
  const [player1Choices, setPlayer1Choices] = useState({
    Rock: 0,
    Paper: 0,
    Scissors: 0,
  });
  const [player2Choices, setPlayer2Choices] = useState({
    Rock: 0,
    Paper: 0,
    Scissors: 0,
  });
  const [appliedPatterns1, setAppliedPatterns1] = useState(new Set());
  const [appliedPatterns2, setAppliedPatterns2] = useState(new Set());
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    if (initialGameResult.length === 0) return;

    const lastResult = initialGameResult[initialGameResult.length - 1];
    if (lastResult) {
      const { local, remote } = lastResult;

      setPlayer1Choices((prevCounts) => ({
        ...prevCounts,
        [local]: (prevCounts[local] || 0) + 1,
      }));

      setPlayer2Choices((prevCounts) => ({
        ...prevCounts,
        [remote]: (prevCounts[remote] || 0) + 1,
      }));
    }
  }, [initialGameResult]);

  const processChoices = useCallback(() => {
    setProcessingComplete(false);
    setAppliedPatterns1((prevPatterns) =>
      checkPatterns(player1Choices, setPlayer1, prevPatterns)
    );
    // console.log("player 1 choices", player1Choices);
    // console.log("player 1 attack", player1.attack);
    setAppliedPatterns2((prevPatterns) =>
      checkPatterns(player2Choices, setPlayer2, prevPatterns)
    );
    // console.log("player 2 choices", player2Choices);
    // console.log("player 2 attack", player2.attack);
    setProcessingComplete(true);
  }, [player1Choices, player2Choices]);

  useEffect(() => {
    processChoices();
  }, [processChoices]);

  useEffect(() => {
    if (processingComplete) {
      if (initialGameResult.length === 0) return;

      const lastResult = initialGameResult[initialGameResult.length - 1];
      const { result } = lastResult;

      console.log("Last Result:", lastResult);
      console.log("Player 1 Attack:", player1.attack);
      console.log("Player 2 Defense:", player2.defense);
      console.log("Player 2 HP before:", player2.hp);
      console.log("Damage Calculation:", player1.attack - player2.defense);

      setPlayer2((prev) => ({
        ...prev,
        hp:
          result === "Win"
            ? Math.max(prev.hp - (player1.attack - player2.defense), 0)
            : prev.hp,
      }));
      setPlayer1((prev) => ({
        ...prev,
        hp:
          result === "Lose"
            ? Math.max(prev.hp - (player2.attack - player1.defense), 0)
            : prev.hp,
      }));
      setProcessingComplete(false); // Reset the flag for future updates
    }
  }, [initialGameResult, processingComplete]);

  useEffect(() => {
    onPlayerStatsUpdate({
      player1: { ...player1 },
      player2: { ...player2 },
    });
    console.log("Player 1 HP after:", player1.hp);
    console.log("Player 2 HP after:", player2.hp);
  }, [player1.hp, player2.hp]);

  return (
    <div className="player-container">
      <Player player={player1} />
      <Player player={player2} />
    </div>
  );
};

export default Game;
