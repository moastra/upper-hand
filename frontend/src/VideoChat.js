import React, { useEffect, useRef, useState, useCallback } from 'react';
import './VideoChat.css';
import useGestureRecognition from './hooks/useGestureRecognition';
import gestureToChoice, { determineWinner } from './utility/determinwinner';
import useCountdown from './hooks/useCountdown';
import { createPeer, getPeerId } from './peerHelper';

const VideoChat = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [connected, setConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [connectedPeerId, setConnectedPeerId] = useState('');
  const [dataConnection, setDataConnection] = useState(null);
  const [remoteData, setRemoteData] = useState('');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [gameResult, setGameResult] = useState([]); // State to store the game result
  const [localImage, setLocalImage] = useState('');
  const [remoteImage, setRemoteImage] = useState('');
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [remoteCountdownStarted, setRemoteCountdownStarted] = useState(false);
  const [rounds, setRounds] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const peerInstance = useRef(null); // Hold the peer instance for both video and chat
  const connInstance = useRef(null); // Connection for chat messages
  const gestureDataRef = useRef(''); // Use a ref to store the gesture data
  const { gestureData, isLoading } = useGestureRecognition(localVideoRef, canvasRef);

  // Fetch the peer ID using the helper function and initialize Peer instance
  useEffect(() => {
    peerInstance.current = createPeer();

    getPeerId((id) => {
      setPeerId(id);
    });

    peerInstance.current.on('connection', (conn) => {
      setDataConnection(conn);
      connInstance.current = conn;  // Store connection instance for chat

      // Handle incoming chat and game data
      conn.on('data', (data) => {
        if (data.type === 'startCountdown') {
          setRemoteCountdownStarted(true); // added
          setIsCountdownActive(true);
        } else if (data.type === 'gestureData') {
          setRemoteData(data.gestureData);
          console.log("line 46 recieved remote data:", data.gestureData);
          setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
        } else {
          setChat((prevChat) => [...prevChat, { message: data, from: 'Peer' }]);
        }
      });

      conn.on('error', (err) => {
        console.error('Connection error:', err);
      });
    });

    peerInstance.current.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with your own video stream

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });

    return () => {
      peerInstance.current.disconnect();
      peerInstance.current.destroy();
    };
  }, []);

  // Function to initiate both video and chat connections to the peer
  const connectToPeer = () => {
    if (!remotePeerId) return;

    // Initiate connection for both chat and video
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      localVideoRef.current.srcObject = stream;

      const call = peerInstance.current.call(remotePeerId, stream);
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });

      const conn = peerInstance.current.connect(remotePeerId);
      conn.on('open', () => {
        setConnectedPeerId(remotePeerId);
        setDataConnection(conn);
        connInstance.current = conn;

        conn.on('data', (data) => {
          if (data.type === 'gestureData') {
            setRemoteData(data.gestureData);
            console.log("line 92 set remote gesture data:", data.gestureData);
            setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
          } else {
            setChat((prevChat) => [...prevChat, { message: data, from: 'Peer' }]);
          }
        });
      });
      conn.on("error", (err) => {
        console.error("Connection error:", err);
      });

      conn.on("close", () => {
        console.log("Data connection closed");
        setDataConnection(null);
      });

      setConnected(true);
    });
  };

  const sendMessage = () => {
    if (connInstance.current && message) {
      connInstance.current.send(message);
      setChat((prevChat) => [...prevChat, { message, from: 'Me' }]);
      setMessage('');
    }
  };

  // Send local gesture data to peer
  const sendGestureData = useCallback(
    (categoryName) => {
      if (dataConnection && dataConnection.open) {
        console.log("Sending gesture data:", categoryName);
        dataConnection.send({ type: 'gestureData', gestureData: categoryName });
      }
    },
    [dataConnection]
  );

  useEffect(() => {
    gestureDataRef.current = gestureData;
  }, [gestureData]);

  const countdownTime = useCountdown(isCountdownActive, () => {
    setIsCountdownActive(false);
    setCountdownStarted(false);
    sendGestureData(gestureDataRef.current);
  });

  const handleCountdownButtonClick = () => {
    setIsCountdownActive(true);
    setCountdownStarted(true);

    if (dataConnection && dataConnection.open) {
      dataConnection.send({ type: 'startCountdown' });
    }
  };

  // Evaluate gestures from both players and determine winner
  useEffect(() => {
    if (gestureData && remoteData) {
      const local = gestureToChoice[gestureData] || { choice: 'Invalid', image: null };
      const remote = gestureToChoice[remoteData] || { choice: 'Invalid', image: null };

      setLocalImage(local.image);
      setRemoteImage(remote.image);

      const result = determineWinner(local.choice, remote.choice);
      console.log("result: ", result);
      console.log("Game Result: ", gameResult);

      setGameResult((prevResults) => [
        ...prevResults,
        {
          round: prevResults.length + 1,
          local: local.choice,
          remote: remote.choice,
          result
        },
      ]);
    }
  }, [remoteData, rounds]);

  const lastResult =
    gameResult.length > 0 ? gameResult[gameResult.length - 1] : null;

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Function to copy the peer ID to the clipboard
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    alert("Copied to clipboard: " + peerId);
  };

  return (
    <div className="container">
      <div className="video-sections">
        <div className="video-top">
          <video ref={localVideoRef} autoPlay muted />
        </div>
        {lastResult && (
          <div className="result-box">
            <img src={localImage} width="80" height="80" />
            <p>Round: {lastResult.round}</p>
            <p>{lastResult.result}</p>
            <img src={remoteImage} width="80" height="80" />
          </div>
        )}
        <div className="video-bottom">
          <video
            ref={remoteVideoRef}
            autoPlay
            className={isCountdownActive ? "video-hidden" : ""}
          />
        </div>
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div className="controls">
        <h3>Your Peer ID: {peerId}
          <button onClick={copyIdToClipboard}>Copy</button>
        </h3>
        <div>
          <input
            type="text"
            placeholder="Remote Peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <a>  </a>
          <button onClick={connectToPeer} disabled={connected}>
            Connect
          </button>
        </div>
        {/* <br></br> */}
        <button onClick={handleCountdownButtonClick} disabled={isCountdownActive}>
          Send Gesture Data (After 3 Sec)
        </button>
        {isCountdownActive && <p>Sending in {countdownTime}...</p>}
      </div>
      <div id="gesture_output"></div>

      <table className="table-container">
        <thead className="title">
          <tr>
            <th>Round</th>
            <th>Local Choice</th>
            <th>Remote Choice</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {gameResult.map((res) => (
            <tr key={res.round}>
              <td>{res.round}</td>
              <td>{res.local}</td>
              <td>{res.remote}</td>
              <td>{res.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="chat-section">
        <h3>Chat:</h3>
        {chat.map((chatItem, index) => (
          <p key={index}><b>{chatItem.from}:</b> {chatItem.message}</p>
        ))}
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>

  );
};

export default VideoChat;
