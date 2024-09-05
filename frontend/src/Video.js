import Peer from "peerjs";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Video.css";
import useGestureRecognition from "./hooks/useGestureRecognition";
import gestureToChoice, { determineWinner } from "./utility/determinwinner";
import useCountdown from "./hooks/useCountdown";
import usePeerJS from "./hooks/usePeerJS";

const Video = () => {
  // const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const canvasRef = useRef(null);
  // const [dataConnection, setDataConnection] = useState(null);
  const [remoteData, setRemoteData] = useState("");
  const [gameResult, setGameResult] = useState(""); // State to store the game result
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [remoteCountdownStarted, setRemoteCountdownStarted] = useState(false);
  const gestureDataRef = useRef(""); // Use a ref to store the gesture data
  const { gestureData, isLoading } = useGestureRecognition(
    localVideoRef,
    canvasRef
  );
  // useEffect(() => {
  //   // Initialize PeerJS
  //   peerInstance.current = new Peer();

  //   peerInstance.current.on("open", (id) => {
  //     setPeerId(id);
  //   });

  //   peerInstance.current.on("connection", (conn) => {
  //     setDataConnection(conn);
  //     //
  //     conn.on("data", (data) => {
  //       if (data.type === "startCountdown") {
  //         setRemoteCountdownStarted(true);
  //         setIsCountdownActive(true);
  //       } else if (data.type === "gestureData") {
  //         setRemoteData(data.gestureData);
  //       }
  //     });

  //     conn.on("error", (err) => {
  //       console.error("Connection error:", err);
  //     });
  //   });

  //   peerInstance.current.on("call", (call) => {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: false })
  //       .then((stream) => {
  //         localVideoRef.current.srcObject = stream;
  //         call.answer(stream); // Answer the call with your own video stream

  //         call.on("stream", (remoteStream) => {
  //           remoteVideoRef.current.srcObject = remoteStream;
  //         });
  //       });
  //   });
  //   return () => {
  //     peerInstance.current.disconnect();
  //     peerInstance.current.destroy();
  //   };
  // }, []);
  const onConnection = (data) => {
    if (data.type === "startCountdown") {
      setRemoteCountdownStarted(true);
      setIsCountdownActive(true);
    } else if (data.type === "gestureData") {
      setRemoteData(data.gestureData);
    }
  };
  const onCall = (call) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((err) => {
        console.error("Media access error:", err);
        alert("Could not access camera. Please check your permissions.");
      });
  };
  const { peerId, callPeer, connectPeer, dataConnection } = usePeerJS(
    onConnection,
    onCall
  );

  useEffect(() => {
    if (dataConnection) {
      dataConnection.on("open", () => {
        setConnected(true);
      });
      dataConnection.on("close", () => {
        setConnected(false);
      });
    }
  }, [dataConnection]);
  // const callPeer = (id) => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: false })
  //     .then((stream) => {
  //       localVideoRef.current.srcObject = stream;

  //       const call = peerInstance.current.call(id, stream);
  //       call.on("stream", (remoteStream) => {
  //         remoteVideoRef.current.srcObject = remoteStream;
  //       });

  //       const conn = peerInstance.current.connect(id);
  //       conn.on("open", () => {
  //         setDataConnection(conn);
  //         console.log("Data connection established");
  //       });
  //       conn.on("data", (data) => {
  //         console.log("Received gesture data:", data);
  //         setRemoteData(data.gestureData); // Update state with received gesture from host
  //       });
  //       conn.on("error", (err) => {
  //         console.error("Connection error:", err);
  //       });

  //       conn.on("close", () => {
  //         console.log("Data connection closed");
  //         setDataConnection(null);
  //       });

  //       setConnected(true);
  //     });
  // };

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
        {isCountdownActive && <p>Sending in {countdownTime}...</p>}
      </div>
      <div id="gesture_output"></div>
    </div>
  );
};

export default Video;
