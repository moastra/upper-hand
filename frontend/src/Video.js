import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import Peer from "peerjs";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Video.css";

const gestureToChoice = {
  Closed_Fist: "Rock",
  Open_Palm: "Paper",
  Victory: "Scissors",
};

const determineWinner = (localChoice, remoteChoice) => {
  if (localChoice === remoteChoice) {
    return "Draw";
  }
  switch (localChoice) {
    case "Rock":
      return remoteChoice === "Scissors" ? "Win" : "Lose";  // To be changed to 1: win, 0: draw, -1: loss
    case "Paper":
      return remoteChoice === "Rock" ? "Win" : "Lose"; // To be changed to 1: win, 0: draw, -1: loss
    case "Scissors":
      return remoteChoice === "Paper" ? "Win" : "Lose"; // To be changed to 1: win, 0: draw, -1: loss
    default:
      return "Invalid";
  }
};

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
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [dataConnection, setDataConnection] = useState(null);
  const [gestureData, setGestureData] = useState("");
  const [remoteData, setRemoteData] = useState("");
  const [gameResult, setGameResult] = useState(""); // State to store the game result

  // Load the hand gesture model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });
        setGestureRecognizer(recognizer);
      } catch (error) {
        console.error("Error loading gesture recognizer model:", error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    // Initialize PeerJS
    peerInstance.current = new Peer();

    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current.on("connection", (conn) => {
      setDataConnection(conn);

      conn.on("data", (data) => {
        console.log("Received gesture data:", data);
        setRemoteData(data); // Update state with received gesture
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
          setRemoteData(data); // Update state with received gesture
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
        dataConnection.send(categoryName);
      } else {
        console.warn("No data connection available or connection is closed.");
      }
    },
    [dataConnection]
  );

  const handleCountdownButtonClick = () => {
    setIsCountdownActive(true);
    setCountdown(3);  //Don't do countdown with state

    const countdownInterval = setInterval(() => { 
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsCountdownActive(false);
          sendGestureData(gestureData); // Send the gesture data after countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (gestureRecognizer && localVideoRef.current) {
      const video = localVideoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let lastVideoTime = -1;

      const predict = async () => { // call when button clicked (enabled when all is loaded[cams, ai])
        const nowInMs = Date.now();

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            try {
              const results = await gestureRecognizer.recognizeForVideo(
                video,
                nowInMs
              );

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const drawingUtils = new DrawingUtils(ctx);

              if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                  drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    { color: "#00FF00", lineWidth: 5 }
                  );
                  drawingUtils.drawLandmarks(landmarks, {
                    color: "#FF0000",
                    lineWidth: 2,
                  });
                }
              }

              const gestureOutput = document.getElementById("gesture_output");
              if (gestureOutput) {
                if (results.gestures.length > 0) {
                  const categoryName = results.gestures[0][0].categoryName;
                  const categoryScore = parseFloat(
                    results.gestures[0][0].score * 100
                  ).toFixed(2);
                  const handedness = results.handednesses[0][0].displayName;
                  gestureOutput.innerText = `Gesture: ${categoryName}\nConfidence: ${categoryScore}%\nHandedness: ${handedness}`;
                  gestureOutput.style.display = "block";

                  setGestureData(categoryName); // Update gestureData state
                } else {
                  gestureOutput.style.display = "none";
                }
              }
            } catch (error) {
              console.error("Error recognizing gesture:", error);
            }
          }
          requestAnimationFrame(predict); // stop listening at end countdown, have boolean for start/stop state (new state)
        } else {
          console.warn("Video dimensions are not valid.");
          requestAnimationFrame(predict);
        }
      };

      predict();
    }
  }, [gestureRecognizer, sendGestureData]);

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
