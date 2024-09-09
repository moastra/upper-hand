import React from "react";
import "./Player.css";
const Player = ({ player }) => {
  return (
    <div className="players">
      <h2>{player.name}</h2>
      <p>HP: {player.hp}</p>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
      <p>Multiplier: {player.multiplier}</p>
    </div>
  );
};

export default Player;
