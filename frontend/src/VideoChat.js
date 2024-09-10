import React, { useEffect, useRef, useState, useCallback } from "react";
import "./VideoChat.css";
import useGestureRecognition from "./hooks/useGestureRecognition";
import gestureToChoice, { determineWinner } from "./utility/determinwinner";
import useCountdown from "./hooks/useCountdown";
import { createPeer, getPeerId } from "./peerHelper";
import { handleDisconnect } from "./utility/disconnectHelper";
const VideoChat = ({
  onGameResult,
  playerStats,
  onRematch,
  rematch,
  disconnected,
  onDisconnect,
  onResponse,
  onPeerStats,
  hostStats,
  peerStats,
}) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [connectedPeerId, setConnectedPeerId] = useState("");
  const [dataConnection, setDataConnection] = useState(null);
  const [remoteData, setRemoteData] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [gameResult, setGameResult] = useState([]); // State to store the game result
  const [localImage, setLocalImage] = useState("");
  const [remoteImage, setRemoteImage] = useState("");
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [remoteCountdownStarted, setRemoteCountdownStarted] = useState(false);
  const [rounds, setRounds] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const peerInstance = useRef(null); // Hold the peer instance for both video and chat
  const gestureDataRef = useRef(""); // Use a ref to store the gesture data
  const { gestureData, isLoading } = useGestureRecognition(
    localVideoRef,
    canvasRef
  );

  const [player1HP, setPlayer1HP] = useState(null);
  const [player2HP, setPlayer2HP] = useState(null);
  const player1InitialHP = hostStats.hp;
  const player2InitialHP = peerStats.hp;
  const peerStatRef = useRef("");
  useEffect(() => {
    if (playerStats.player1 && playerStats.player2) {
      setPlayer1HP(playerStats.player1.hp);
      setPlayer2HP(playerStats.player2.hp);
    }
    // console.log(
    //   "player1 hp%",
    //   player1Percentage,
    //   "player1hp",
    //   player1HP,
    //   "player1 initi",
    //   player1InitialHP
    // );
  }, [playerStats]);
  const player1Percentage = (player1HP / player1InitialHP) * 100;
  const player2Percentage = (player2HP / player2InitialHP) * 100;
  //calculate the percentage of hp
  // Fetch the peer ID using the helper function and initialize Peer instance
  useEffect(() => {
    peerInstance.current = createPeer();

    getPeerId((id) => {
      setPeerId(id);
    });

    peerInstance.current.on("connection", (conn) => {
      setDataConnection(conn);

      // Handle incoming chat and game data
      conn.on("data", (data) => {
        if (data.type === "startCountdown") {
          setRemoteCountdownStarted(true); // added
          setIsCountdownActive(true);
        } else if (data.type === "gestureData") {
          setRemoteData(data.gestureData);
          setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
        } else if (data.type === "rematch") {
          resetForRematch();
        } else if (data.type === "disconnect") {
          disconnect();
        } else if (data.type === "stats") {
          onPeerStats(data.stats);
          peerStatRef.current = data.stats;
        } else {
          setChat((prevChat) => [...prevChat, { message: data, from: "Peer" }]);
        }
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
      });
    });

    peerInstance.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with your own video stream

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });

    return () => {
      peerInstance.current.disconnect();
      peerInstance.current.destroy();
    };
  }, []);
  // Function to fetch initial player data from the database
  // const fetchInitialPlayerData = async () => {
  //   try {
  //     const response = await axios.get("/api/stats:id");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching player data:", error);
  //     return {};
  //   }
  // };
  // Function to initiate both video and chat connections to the peer
  const connectToPeer = () => {
    // const connectToPeer = async() => {
    if (!remotePeerId) return;
    // Ensure peerInstance.current is initialized
    if (!peerInstance.current) {
      peerInstance.current = createPeer();
    }
    //fetch the playerData
    // const playerData = await fetchInitialPlayerData();
    // Initiate connection for both chat and video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const call = peerInstance.current.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });

        const conn = peerInstance.current.connect(remotePeerId);
        conn.on("open", () => {
          setConnectedPeerId(remotePeerId);
          setDataConnection(conn);
        });
        conn.on("error", (err) => {
          console.error("Connection error:", err);
        });

        conn.on("close", () => {
          console.log("Data connection closed");
          setDataConnection(null);
        });

        conn.on("data", (data) => {
          if (data.type === "startCountdown") {
            setRemoteCountdownStarted(true); // added
            setIsCountdownActive(true);
          } else if (data.type === "gestureData") {
            setRemoteData(data.gestureData);
            console.log("line 92 set remote gesture data:", data.gestureData);
            setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
          } else if (data.type === "disconnect") {
            disconnect();
          } else if (data.type === "rematch") {
            resetForRematch();
          } else if (data.type === "stats") {
            onPeerStats(data.stats);
          } else {
            setChat((prevChat) => [
              ...prevChat,
              { message: data, from: "Peer" },
            ]);
          }
        });
        setConnected(true);
      });
  };

  const sendMessage = () => {
    if (dataConnection.open && message) {
      dataConnection.send(message);
      setChat((prevChat) => [...prevChat, { message, from: "Me" }]);
      setMessage("");
    }
  };

  // Send local gesture data to peer
  const sendGestureData = useCallback(
    (categoryName) => {
      if (dataConnection && dataConnection.open) {
        console.log("Sending gesture data:", categoryName);
        dataConnection.send({ type: "gestureData", gestureData: categoryName });
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
    if (dataConnection && dataConnection.open) {
      dataConnection.send({ type: "startCountdown" });
    }
    setIsCountdownActive(true);
    setCountdownStarted(true);
  };

  // Evaluate gestures from both players and determine winner
  useEffect(() => {
    if (gestureData && remoteData) {
      const local = gestureToChoice[gestureData] || {
        choice: "Invalid",
        image: null,
      };
      const remote = gestureToChoice[remoteData] || {
        choice: "Invalid",
        image: null,
      };

      setLocalImage(local.image);
      setRemoteImage(remote.image);

      const result = determineWinner(local.choice, remote.choice);
      // console.log("result: ", result);
      // console.log("Game Result: ", gameResult);

      setGameResult((prevResults) => [
        ...prevResults,
        {
          round: prevResults.length + 1,
          local: local.choice,
          remote: remote.choice,
          result,
        },
      ]);
    }
  }, [remoteData, rounds]);

  const lastResult =
    gameResult.length > 0 ? gameResult[gameResult.length - 1] : null;
  useEffect(() => {
    if (gameResult) {
      onGameResult(gameResult);
    }
  }, [gameResult, onGameResult]);

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Function to copy the peer ID to the clipboard
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    alert("Copied to clipboard: " + peerId);
  };

  const resetForRematch = async () => {
    // Reset video chat state as needed
    setRemoteData("");
    setGameResult([]);
    setLocalImage("");
    setRemoteImage("");
    setRounds(0);
    gestureDataRef.current = "";
    setRemoteData("");
    onGameResult([]); // Notify parent component about the reset
    onResponse(true);
    onRematch(false);
  };

  useEffect(() => {
    if (rematch === true) {
      if (dataConnection && dataConnection.open) {
        dataConnection.send({ type: "rematch" }); // Notify remote peer about the rematch
      }
      resetForRematch();
    }
  }, [rematch]);

  const disconnect = async () => {
    handleDisconnect(
      localVideoRef,
      remoteVideoRef,
      canvasRef,
      setRemotePeerId,
      setConnected,
      setDataConnection,
      setChat,
      setMessage,
      setGameResult,
      setLocalImage,
      setRemoteImage,
      setRounds
    );
    gestureDataRef.current = "";
    setRemoteData("");
    onPeerStats("");
    setGameResult([]); // Ensure game result is cleared
    onGameResult([]); // Notify parent component about the reset
    onResponse(true);

    onDisconnect(false); // Ensure this callback is properly defined
  };

  useEffect(() => {
    if (disconnected === true) {
      if (dataConnection && dataConnection.open) {
        dataConnection.send({ type: "disconnect" });
        console.log("Disconnect signal sent");
      }
      disconnect();
    }
  }, [disconnected]);

  const sendingStats = () => {
    if (dataConnection && dataConnection.open) {
      console.log("Data connection status:", dataConnection?.open);
      console.log("Sending host stats:", hostStats);
      dataConnection.send({ type: "stats", stats: hostStats });
    } else {
      console.error("Data connection is not open");
    }
  };

  useEffect(() => {
    if (peerStats === peerStatRef.current) {
      sendingStats();
      console.log("sending stats using effect");
    }
  }, [dataConnection, peerStats]);

  return (
    <div className="container">
      <div className="video-sections">
        <div className="video-top">
          <video ref={localVideoRef} autoPlay muted />
          <div
            className="hp-bar local"
            style={{ width: `${player1Percentage}%` }}
          >
            Player 1 HP: {player1HP}
          </div>
        </div>
        {lastResult && (
          <div className="result-box">
            <img src={localImage} width="80" height="80" alt="Local Gesture" />
            <p>Round: {lastResult.round}</p>
            <p>{lastResult.result}</p>
            <img
              src={remoteImage}
              width="80"
              height="80"
              alt="Remote Gesture"
            />
          </div>
        )}
        <div className="video-bottom">
          <video
            ref={remoteVideoRef}
            autoPlay
            className={isCountdownActive ? "video-hidden" : ""}
          />
          <div
            className="hp-bar remote"
            style={{ width: `${player2Percentage}%` }}
          >
            Player 2 HP: {player2HP}
          </div>
        </div>
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div className="controls">
        <h3>
          Your Peer ID: {peerId}
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
        <button
          onClick={handleCountdownButtonClick}
          disabled={isCountdownActive}
        >
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
        <h3>Chat</h3>
        {chat.map((chatItem, index) => (
          <p key={index}>
            <b>{chatItem.from}:</b> {chatItem.message}
          </p>
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
      {/* {showRematchButton && (
        <button onClick={handleRematchButtonClick}>Rematch</button>
      )} */}
    </div>
  );
};

export default VideoChat;
