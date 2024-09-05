// Client.js
import React, { useRef, useEffect, useCallback, useState } from "react";
import Peer from "peerjs";
import useStageMode from "./hooks/useStageMode";

const Client = ({ onConnected, onDataReceived }) => {
  const { mode, handleClientConnected, handleClientReady } = useStageMode();
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [dataConnection, setDataConnection] = useState(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    if (mode === "READY") {
      peerInstance.current = new Peer();

      peerInstance.current.on("open", (id) => {
        setPeerId(id);
      });

      peerInstance.current.on("connection", (conn) => {
        setDataConnection(conn);
        handleClientConnected();
        onConnected();

        conn.on("data", (data) => {
          onDataReceived(data);
        });

        conn.on("error", (err) => {
          console.error("Connection error:", err);
        });
      });
    }
  }, [mode, handleClientConnected, onConnected, onDataReceived]);

  const connectToHost = useCallback(() => {
    if (!remotePeerId) return;

    const conn = peerInstance.current.connect(remotePeerId);

    conn.on("open", () => {
      setDataConnection(conn);
      handleClientReady();
    });

    conn.on("error", (err) => {
      console.error("Connection error:", err);
    });
  }, [remotePeerId, handleClientReady]);

  return (
    <div>
      <input
        type="text"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
        placeholder="Enter remote peer ID"
      />
      <button onClick={connectToHost} disabled={!remotePeerId}>
        Connect to Host
      </button>
      <p>Your Peer ID: {peerId}</p>
    </div>
  );
};

export default Client;
