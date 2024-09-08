import React from "react";

const Player = ({ player }) => {
  return (
    <div>
      <h2>{player.name}</h2>
      <p>HP: {player.hp}</p>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
    </div>
  );
};

export default Player;
