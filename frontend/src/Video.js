import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
// import socket from "./socket";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';

const Video = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef();
  const canvasRef = useRef(null);
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => socket.disconnect('chatMessage');
  }, []);

  // useEffect(() => {
  //   const loadModel = async () => {
  //     try {
  //       const vision = await FilesetResolver.forVisionTasks(
  //         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm/"
  //       );
  //       const recognizer = await GestureRecognizer.createFromOptions(vision, {
  //         baseOptions: {
  //           modelAssetPath:
  //             "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
  //           delegate: "GPU",
  //         },
  //         runningMode: "VIDEO",
  //       });
  //       setGestureRecognizer(recognizer);
  //     } catch (error) {
  //       console.error("Error loading gesture recognizer model:", error);
  //     }
  //   };
  //   loadModel();
  // }, []);
  useEffect(() => {
    // Initialize PeerJS
    peerInstance.current = new Peer();

    // Set your own peer ID
    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });


    // Handle incoming call
    peerInstance.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with your own video stream

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });

    // Inside the useEffect or other relevant function
    // peerInstance.current.on("signal", (signal) => {
    //   socket.emit("signal", { to: remotePeerId, from: peerId, signal });
    });

    // Handle signals received from other peers through socket.io
  //   socket.on("signal", (data) => {
  //     const { from, signal } = data;
  //     if (peerInstance.current) {
  //       peerInstance.current.signal(signal);
  //     }
  //   });
  // }, []);

  const callPeer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const call = peerInstance.current.call(id, stream); // Call the remote peer by their peer ID
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });

        setConnected(true);
      });
  };
  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
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
    </div>
  );
}

export default Video;
