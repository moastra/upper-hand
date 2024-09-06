import Peer from "peerjs";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Video.css";
import useGestureRecognition from "./hooks/useGestureRecognition";
import gestureToChoice, { determineWinner } from "./utility/determinwinner";
import useCountdown from "./hooks/useCountdown";

const Video = () => {
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
  const [remoteCountdownStarted, setRemoteCountdownStarted] = useState(false);
  const [localImage, setLocalImage] = useState("");
  const [remoteImage, setremoteImage] = useState("");
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
        if (data.type === "startCountdown") {
          setRemoteCountdownStarted(true);
          setIsCountdownActive(true);
        } else if (data.type === "gestureData") {
          setRemoteData(data.gestureData);
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
      //store the results in a array
      setGameResult((prevResults) => [
        ...prevResults,
        {
          round: prevResults.length + 1,
          local: local.choice,
          remote: remote.choice,
          result,
        },
      ]);
      console.log(gameResult);
    }
  }, [remoteData]);
  const lastResult =
    gameResult.length > 0 ? gameResult[gameResult.length - 1] : null;
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
