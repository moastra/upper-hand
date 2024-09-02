import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Chat from "./Chat";
import socket from "./socket";
import Video from "./Video";

const App = () => {
  return (
    <div className="App">
      <Chat />
      <Video />
    </div>
  );
};

export default App;

// import React from 'react';
// import Chat from './Chat';

// function App() {
//   return (
//     <div className="App">
//       <Chat />
//     </div>
//   );
// }

// export default App;
