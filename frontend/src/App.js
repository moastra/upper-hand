import React from "react";
// import Video from "./Video";
// import PeerChat from "./PeerChat";
import VideoChat from "./VideoChat";
import LobbyChat from "./LobbyChat";


const App = () => {
  return (
    <div className="App">
      <LobbyChat />
      <VideoChat />
      {/* <Chat /> */}
      {/* <Video /> */}
      {/* <PeerChat /> */}
    </div>
  );
};

export default App;
