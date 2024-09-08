import React from "react";
import Chat from "./Chat";
import Video from "./Video";
import PeerChat from "./PeerChat";
import VideoChat from "./VideoChat";

const App = () => {
  return (
    <div className="App">
      <VideoChat />
      {/* <Chat /> */}
      {/* <Video /> */}
      {/* <PeerChat /> */}
    </div>
  );
};

// function App() {
//   return (
//     <div className="App">
//       <Chat />
//     </div>
//   );
// }

export default App;
