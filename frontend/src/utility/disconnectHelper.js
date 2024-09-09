import React from "react";

export const handleDisconnect = (
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
) => {
  // Stop local video stream
  if (localVideoRef.current && localVideoRef.current.srcObject) {
    const localStream = localVideoRef.current.srcObject;
    const tracks = localStream.getTracks();
    tracks.forEach((track) => track.stop()); // Stop all tracks
    localVideoRef.current.srcObject = null; // Clear the video element
  }

  // Stop remote video stream
  if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
    const remoteStream = remoteVideoRef.current.srcObject;
    const tracks = remoteStream.getTracks();
    tracks.forEach((track) => track.stop()); // Stop all tracks
    remoteVideoRef.current.srcObject = null; // Clear the video element
  }

  // Clear canvas
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
    }
  }

  // Reset relevant state variables
  setRemotePeerId("");
  setConnected(false);
  setDataConnection(null);
  setChat([]);
  setMessage("");
  setGameResult([]);
  setLocalImage("");
  setRemoteImage("");
  setRounds(0);
};

export default handleDisconnect;
