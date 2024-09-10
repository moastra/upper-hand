import React, { useEffect, useState, useCallback } from "react";
import Player from "./Player";
import { checkPatterns } from "../utility/roundpattern";
import "./Game.css";
import { updatePlayerHP } from "../utility/updatePlayerHp";
import PowerUpInfo, { applyPowerUp } from "../utility/powerUpUtils";
import { fetchCustomizationData } from "../utility/fetchCustomizeData";

// const initialPlayerState = {
//   name: "Player 1",
//   hp: 300,
//   attack: 10,
//   defense: 5,
//   multiplier: 1,
//   powerUp: 1,
// };

const Game = ({
  initialGameResult,
  onPlayerStatsUpdate,
  onDisconnect,
  onRematch,
  response,
  onResponse,
  onHostStats,
  peerStats,
}) => {
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
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
  const [gameOver, setGameOver] = useState(false); // State to check if game is over
  const [winner, setWinner] = useState(null); // State to store the winner
  const maxRound = 5;
  const [powerUpApplied, setPowerUpApplied] = useState({
    player1: false,
    player2: false,
  });
  const [showRematchPopup, setShowRematchPopup] = useState(false);
  const [initialPlayerState, setInitialPlayerState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomizationData();
        const { stats, powerUps } = data;
        console.log("power ups", powerUps);
        const initPlayer = {
          name: "Player 1",
          hp: stats.hp,
          attack: stats.atk,
          defense: stats.def,
          multiplier: 1,
          powerUp: powerUps[0].id,
        };
        const player1WithPowerUp = applyPowerUp(initPlayer, initPlayer.powerUp);
        setInitialPlayerState(player1WithPowerUp);
        console.log(player1WithPowerUp);
      } catch (error) {
        console.log("error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPlayer1(initialPlayerState);
    onHostStats(initialPlayerState);
  }, [initialPlayerState]);

  useEffect(() => {
    if (peerStats) {
      setPlayer2(peerStats);
    }
  }, [peerStats]);

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
    console.log("player1 choice", player1Choices);
    console.log("player2 choice", player2Choices);
    setProcessingComplete(true);
  }, [player1Choices, player2Choices]);

  useEffect(() => {
    processChoices();
  }, [processChoices]);

  useEffect(() => {
    if (processingComplete) {
      if (initialGameResult.length === 0) return;

      const lastResult = initialGameResult[initialGameResult.length - 1];
      const { round, result } = lastResult;

      setPlayer2((prev) => ({
        ...prev,
        hp:
          result === "Win"
            ? updatePlayerHP(
                prev.hp,
                player1.attack,
                player2.defense,
                player1.multiplier
              )
            : prev.hp,
      }));
      setPlayer1((prev) => ({
        ...prev,
        hp:
          result === "Lose"
            ? updatePlayerHP(
                prev.hp,
                player2.attack,
                player1.defense,
                player2.multiplier
              )
            : prev.hp,
      }));
      // Check if the game should end
      if (round >= maxRound || player1.hp <= 0 || player2.hp <= 0) {
        let winner;
        if (player1.hp <= 0 && player2.hp <= 0) {
          winner = "Draw";
        } else if (player1.hp <= 0) {
          winner = player2.name;
        } else if (player2.hp <= 0) {
          winner = player1.name;
        } else {
          winner = player1.hp > player2.hp ? player1.name : player2.name;
        }
        setWinner(winner);
        setGameOver(true);
      }
      setProcessingComplete(false); // Reset the flag for future updates
      setShowRematchPopup(true);
    }
  }, [initialGameResult, processingComplete]);

  useEffect(() => {
    onPlayerStatsUpdate({
      player1: { ...player1 },
      player2: { ...player2 },
    });
  }, [player1.hp, player2.hp]);

  const resetGameState = () => {
    setPlayer1(initialPlayerState);
    setPlayer2(peerStats);
    setPlayer1Choices({ Rock: 0, Paper: 0, Scissors: 0 });
    setPlayer2Choices({ Rock: 0, Paper: 0, Scissors: 0 });
    setAppliedPatterns1(new Set());
    setAppliedPatterns2(new Set());
    setProcessingComplete(false);
    setShowPopup(false);
    setPatternMessages([]);
    setGameOver(false);
    setWinner(null);
    setShowRematchPopup(false);
    setPowerUpApplied({
      player1: false,
      player2: false,
    });
  };
  const handleRematch = () => {
    resetGameState();
    onRematch(true); // Notify the parent component if needed
    onPlayerStatsUpdate({
      player1: { ...player1 },
      player2: { ...player2 },
    });
  };

  const handleDisconnect = () => {
    resetGameState();
    onDisconnect(true); // Notify the parent component if needed
    onPlayerStatsUpdate({
      player1: { ...player1 },
      player2: { ...player2 },
    });
  };
  useEffect(() => {
    if (response === true) {
      resetGameState();
      onPlayerStatsUpdate({
        player1: { ...player1 },
        player2: { ...player2 },
      });
      onResponse(false);
    }
  }, [response]);
  return (
    <div className="player-container">
      <div className="player1-container">
        <Player player={player1} />
      </div>
      <div className="player2-container">
        <Player player={player2} />
      </div>
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
      <div className="power-ups">
        <div className="player1-power-up">
          <PowerUpInfo player={player1} />
        </div>
        <div className="player2-power-up">
          <PowerUpInfo player={player2} />
        </div>
      </div>
      {gameOver && showRematchPopup && (
        <div className="popup gameover">
          <h2>Game Over!</h2>
          <p>{winner === "Draw" ? "It's a draw!" : `${winner} wins!`}</p>
          <button onClick={handleRematch}>Rematch</button>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default Game;
