import React from "react";
import "./Player.css";
const Player = ({ player }) => {
  const getMultiplierClass = (multiplier) => {
    if (multiplier === 1) return "";
    if (multiplier === 1.5) return "shadow-low";
    if (multiplier === 2) return "shadow-medium";
    if (multiplier === 3) return "shadow-high";
  };
  return (
    <div className={`players ${getMultiplierClass(player.multiplier)}`}>
      <h2>{player.name}</h2>
      <p>HP: {player.hp}</p>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
      <p>Multiplier: {player.multiplier}</p>
    </div>
  );
};

export default Player;
