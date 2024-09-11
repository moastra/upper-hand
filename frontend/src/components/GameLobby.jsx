import React from "react";
import VideoChat from "../VideoChat";
import FindMatch from "./FindMatch";

const GameLobby = (props) => {
  // Lift the lobby state up to the parent component
  return (
    <div>
      {/* <VideoChat addLobby={props.addLobby} /> */}
      <FindMatch lobbies={props.lobbies} setLobbies={props.setLobbies} />
    </div>
  );
};

export default GameLobby;