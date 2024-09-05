import Peer from "peerjs";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Video.css";
import useGestureRecognition from "./hooks/useGestureRecognition";
import gestureToChoice, { determineWinner } from "./utility/determinwinner";

const Video = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const canvasRef = useRef(null);
  const [dataConnection, setDataConnection] = useState(null);
  const [remoteData, setRemoteData] = useState("");
  const [gameResult, setGameResult] = useState(""); // State to store the game result
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [remoteCountdownStarted, setRemoteCountdownStarted] = useState(false);
  const gestureDataRef = useRef(""); // Use a ref to store the gesture data
  const { gestureData, isLoading } = useGestureRecognition(
    localVideoRef,
    canvasRef
  );
  useEffect(() => {
    // Initialize PeerJS
    peerInstance.current = new Peer();

    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current.on("connection", (conn) => {
      setDataConnection(conn);
      //
      conn.on("data", (data) => {
        console.log("Received gesture data:", data.gestureData);
        setRemoteData(data.gestureData); // Update state with received gesture from connector
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
          console.log("Received gesture data:", data);
          setRemoteData(data.gestureData); // Update state with received gesture from host
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

  const handleCountdownButtonClick = () => {
    setIsCountdownActive(true);
    setCountdown(3);
    setCountdownStarted(true);

    // Notify the remote peer to start the countdown
    if (dataConnection && dataConnection.open) {
      dataConnection.send({ type: "startCountdown" });
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsCountdownActive(false);
          setCountdownStarted(false);
          sendGestureData(gestureData); // Send gesture data after countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    gestureDataRef.current = gestureData;
  }, [gestureData]);

  useEffect(() => {
    if (dataConnection && gestureData) {
      dataConnection.on("data", (data) => {
        if (data.type === "startCountdown") {
          setRemoteCountdownStarted(true);

          // Start the countdown logic for the remote peer
          setIsCountdownActive(true);
          setCountdown(3);
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(countdownInterval);
                setIsCountdownActive(false);
                setRemoteCountdownStarted(false);
                sendGestureData(gestureDataRef.current);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else if (data.type === "gestureData") {
          setRemoteData(data.gestureData);
        }
      });
    }
  }, [dataConnection, gestureData]);

  useEffect(() => {
    if (gestureData && remoteData) {
      const localChoice = gestureToChoice[gestureData] || "Invalid";
      const remoteChoice = gestureToChoice[remoteData] || "Invalid";
      const result = determineWinner(localChoice, remoteChoice);
      setGameResult(result);
    }
  }, [gestureData, remoteData]);

  return (
    <div className="container">
      <div className="video-sections">
        <div className="video-top">
          <video ref={localVideoRef} autoPlay muted />
        </div>
        <div className="result-box">
          <p>{gameResult}</p>
        </div>
        <div className="video-bottom">
          <video ref={remoteVideoRef} autoPlay />
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
        {isCountdownActive && <p>Sending in {countdown}...</p>}
      </div>
      <div id="gesture_output"></div>
    </div>
  );
};

export default Video;
