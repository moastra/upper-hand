import React, { useState } from "react";
import VideoChat from "../VideoChat";
import FindMatch from "./FindMatch";

const GameLobby = () => {
  // Lift the lobby state up to the parent component
  const [lobbies, setLobbies] = useState([]);

  // Function to add a new lobby (from VideoChat)
  const addLobby = (peerId) => {
    const newLobby = { peerId: peerId, hostName: "Host 1" }; // Customize hostName as needed
    setLobbies((prevLobbies) => [...prevLobbies, newLobby]);
  };

  return (
    <div>
      <VideoChat playerStats={playerStats} hostStats={hostStats} addLobby={addLobby} />
      <FindMatch lobbies={lobbies} />
    </div>
  );
};

export default GameLobby;