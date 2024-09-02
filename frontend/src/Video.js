import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import socket from "./socket";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

const Video = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const canvasRef = useRef(null);
  const [gestureRecognizer, setGestureRecognizer] = useState(null);

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

  // Initialize PeerJS and handle peer events
  useEffect(() => {
    peerInstance.current = new Peer();

    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    });

    peerInstance.current.on("signal", (signal) => {
      socket.emit("signal", { to: remotePeerId, from: peerId, signal });
    });

    socket.on("signal", (data) => {
      const { from, signal } = data;
      if (peerInstance.current) {
        peerInstance.current.signal(signal);
      }
    });

    return () => {
      peerInstance.current.destroy(); // Clean up PeerJS instance on component unmount
    };
  }, [remotePeerId, peerId]);

  // Call a peer
  const callPeer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const call = peerInstance.current.call(id, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });

        setConnected(true);
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  };

  // Gesture recognition
  useEffect(() => {
    if (gestureRecognizer && localVideoRef.current) {
      const video = localVideoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let lastVideoTime = -1;

      const predict = async () => {
        const nowInMs = Date.now();

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          // Ensure dimensions are valid
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
                } else {
                  gestureOutput.style.display = "none";
                }
              }
            } catch (error) {
              console.error("Error recognizing gesture:", error);
            }
          }
          requestAnimationFrame(predict);
        } else {
          // Handle cases where video dimensions are not valid
          console.warn("Video dimensions are not valid.");
          requestAnimationFrame(predict); // Continue polling
        }
      };

      predict();
    }
  }, [gestureRecognizer]);

  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
        <canvas ref={canvasRef} style={{ position: "absolute" }} />
      </div>
      <div>
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
      </div>
      <div id="gesture_output" style={{ display: "none" }}></div>
    </div>
  );
};

export default Video;
