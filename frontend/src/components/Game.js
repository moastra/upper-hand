import React, { useEffect, useState, useCallback } from "react";
import Player from "./Player";
import { checkPatterns } from "../utility/roundpattern";
import "./Game.css";
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
  const [showPopup, setShowPopup] = useState(false); // State for the pop-up
  const [patternMessages, setPatternMessages] = useState([]);

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
    const { updatedPatterns: patterns1, patternMessages: messages1 } =
      checkPatterns(player1Choices, setPlayer1, appliedPatterns1);
    const { updatedPatterns: patterns2, patternMessages: messages2 } =
      checkPatterns(player2Choices, setPlayer2, appliedPatterns2);

    setAppliedPatterns1(patterns1);
    setAppliedPatterns2(patterns2);

    // const combinedMessages = [...messages1, ...messages2];
    if (messages1.length > 0) {
      setPatternMessages(messages1);
      setShowPopup(true);
    }

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
      {showPopup && (
        <div className="popup">
          <h2>Pattern Applied!</h2>
          <ul>
            {patternMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Game;
