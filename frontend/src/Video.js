import Peer from "peerjs";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Video.css";
import useGestureRecognition from "./hooks/useGestureRecognition";
import gestureToChoice, { determineWinner } from "./utility/determinwinner";
import useCountdown from "./hooks/useCountdown";

const Video = ({ onGameResult, playerStats }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const canvasRef = useRef(null);
  const [dataConnection, setDataConnection] = useState(null);
  const [remoteData, setRemoteData] = useState("");
  const [gameResult, setGameResult] = useState([]); // State to store the game result
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [localImage, setLocalImage] = useState("");
  const [rounds, setRounds] = useState(0);
  const [remoteImage, setremoteImage] = useState("");
  const [player1HP, setPlayer1HP] = useState(100);
  const [player2HP, setPlayer2HP] = useState(100);

  const gestureDataRef = useRef(""); // Use a ref to store the gesture data
  const { gestureData, isLoading } = useGestureRecognition(
    localVideoRef,
    canvasRef
  );
  // Update HP from playerStats
  useEffect(() => {
    if (playerStats.player1 && playerStats.player2) {
      setPlayer1HP(playerStats.player1.hp);
      setPlayer2HP(playerStats.player2.hp);
    }
  }, [playerStats]);

  const player1Percentage = (player1HP / 300) * 100; // change to max hp depend on player later
  const player2Percentage = (player2HP / 300) * 100; // change to max hp depend on player later

  useEffect(() => {
    // Initialize PeerJS
    peerInstance.current = new Peer();

    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current.on("connection", (conn) => {
      setDataConnection(conn);

      conn.on("data", (data) => {
        if (data.type === "startCountdown") {
          setIsCountdownActive(true);
        } else if (data.type === "gestureData") {
          setRemoteData(data.gestureData);
          console.log("line 46 recieved remote data:", data.gestureData);
          setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
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

  const callPeer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const call = peerInstance.current.call(id, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });

        const conn = peerInstance.current.connect(id);
        conn.on("open", () => {
          setDataConnection(conn);
          console.log("Data connection established");
        });
        conn.on("data", (data) => {
          setRemoteData(data.gestureData); // Update state with received gesture from host
          console.log("line 92 set remote gesture data:", data.gestureData);
          setRounds((prevRounds) => prevRounds + 1); // Increment rounds count
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
  //this get's called thrid
  const sendGestureData = useCallback(
    (categoryName) => {
      if (dataConnection && dataConnection.open) {
        console.log("Sending gesture data:", categoryName);
        dataConnection.send({ type: "gestureData", gestureData: categoryName });
      } else {
        console.warn("No data connection available or connection is closed.");
      }
    },
    [dataConnection]
  );

  useEffect(() => {
    gestureDataRef.current = gestureData;
  }, [gestureData]);
  //this get's called second
  const countdownTime = useCountdown(isCountdownActive, () => {
    setIsCountdownActive(false);
    setCountdownStarted(false);
    sendGestureData(gestureDataRef.current);
  });

  //handleCountdown button get's click first
  const handleCountdownButtonClick = () => {
    setIsCountdownActive(true);
    setCountdownStarted(true);

    if (dataConnection && dataConnection.open) {
      dataConnection.send({ type: "startCountdown" });
    }
  };

  useEffect(() => {
    if (gestureData && remoteData) {
      const local = gestureToChoice[gestureData] || {
        choice: "Invalid",
        image: null,
      };
      setLocalImage(local.image);
      const remote = gestureToChoice[remoteData] || {
        choice: "Invalid",
        image: null,
      };
      setremoteImage(remote.image);
      const result = determineWinner(local.choice, remote.choice);
      // Store the results in an array
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
        <h3>Your Peer ID: {peerId}</h3>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={() => callPeer(remotePeerId)} disabled={connected}>
          Call
        </button>
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
    </div>
  );
};

export default Video;
