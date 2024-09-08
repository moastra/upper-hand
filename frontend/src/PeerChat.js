// src/PeerChat.js
import React, { useState, useEffect, useRef } from 'react';
import { createPeer, getPeerId } from './peerHelper';

const PeerChat = () => {
  const [myId, setMyId] = useState('');
  const [peerId, setPeerId] = useState('');
  const [connectedPeerId, setConnectedPeerId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const connInstance = useRef(null);

  useEffect(() => {
    // Initialize the peer instance
    const peer = createPeer();

    // Get the peer ID when it's ready
    getPeerId((id) => {
      setMyId(id);
      console.log('My peer ID is: ', id);
    });

    // Handle incoming connections
    peer.on('connection', (conn) => {
      connInstance.current = conn;
      setConnectedPeerId(conn.peer);

      conn.on('data', (data) => {
        setChat((prev) => [...prev, { message: data, from: 'Peer' }]);
      });
    });

    // Handle errors
    peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });

    return () => {
      peer.destroy(); // Clean up when the component unmounts
    };
  }, []);

  // Function to connect to a peer
  const connectToPeer = () => {
    const peer = createPeer();
    const conn = peer.connect(peerId);
    connInstance.current = conn;

    conn.on('open', () => {
      setConnectedPeerId(peerId);
      console.log('Connected to: ', peerId);

      conn.on('data', (data) => {
        setChat((prev) => [...prev, { message: data, from: 'Peer' }]);
      });
    });
  };

  // Function to send a message
  const sendMessage = () => {
    if (connInstance.current && message) {
      connInstance.current.send(message);
      setChat((prev) => [...prev, { message, from: 'Me' }]);
      setMessage('');
    }
  };

  // Function to copy Peer ID to clipboard
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(myId);
    alert("Copied to clipboard: " + myId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My ID: {myId}</h2>
      <button onClick={copyIdToClipboard}>Copy ID</button>

      <h3>Connected Peer ID: {connectedPeerId || 'Not connected'}</h3>

      <div>
        <input
          type="text"
          placeholder="Enter peer ID"
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Chat:</h3>
        {chat.map((chatItem, index) => (
          <p key={index}><b>{chatItem.from}:</b> {chatItem.message}</p>
        ))}
      </div>
    </div>
  );
};

export default PeerChat;


// // Original implementation
// import React, { useState, useEffect, useRef } from 'react';
// import Peer from 'peerjs';
// import { v4 as uuidV4 } from 'uuid';

// const App = () => {
//   const [myId, setMyId] = useState('');
//   const [peerId, setPeerId] = useState('');
//   const [connectedPeerId, setConnectedPeerId] = useState('');
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const peerInstance = useRef(null);
//   const connInstance = useRef(null);

//   useEffect(() => {
//     peerInstance.current = new Peer();

//     peerInstance.current.on("open", (id) => {
//       setPeerId(id);
//     });

//     // When the peer connection is opened, store and display the peer ID
//     peerInstance.current.on('open', (id) => {
//       setMyId(id);
//       console.log('My peer ID is: ', id);
//     });

//     // When a connection is received from another peer
//     peerInstance.current.on('connection', (conn) => {
//       connInstance.current = conn;
//       setConnectedPeerId(conn.peer);

//       conn.on('data', (data) => {
//         setChat((prev) => [...prev, { message: data, from: 'Peer' }]);
//       });
//     });

//     // Error handling
//     peerInstance.current.on('error', (err) => {
//       console.error('PeerJS error:', err);
//     });

//     return () => {
//       peerInstance.current.destroy(); // Clean up the peer connection when the component unmounts
//     };
//   }, []);

//   // Function to connect to a peer
//   const connectToPeer = () => {
//     const conn = peerInstance.current.connect(peerId);
//     connInstance.current = conn;

//     conn.on('open', () => {
//       setConnectedPeerId(peerId);
//       console.log('Connected to: ', peerId);

//       conn.on('data', (data) => {
//         setChat((prev) => [...prev, { message: data, from: 'Peer' }]);
//       });
//     });
//   };

//   // Function to send a message
//   const sendMessage = () => {
//     if (connInstance.current && message) {
//       connInstance.current.send(message);
//       setChat((prev) => [...prev, { message, from: 'Me' }]);
//       setMessage('');
//     }
//   };

//   // Function to copy Peer ID to clipboard
//   const copyIdToClipboard = () => {
//     navigator.clipboard.writeText(myId);
//     alert("Copied to clipboard: " + myId);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>My ID: {myId}</h2>
//       <button onClick={copyIdToClipboard}>Copy ID</button>

//       <h3>Connected Peer ID: {connectedPeerId || 'Not connected'}</h3>

//       <div>
//         <input
//           type="text"
//           placeholder="Enter peer ID"
//           onChange={(e) => setPeerId(e.target.value)}
//         />
//         <button onClick={connectToPeer}>Connect</button>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <h3>Chat:</h3>
//         {chat.map((chatItem, index) => (
//           <p key={index}><b>{chatItem.from}:</b> {chatItem.message}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;
