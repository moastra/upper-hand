import React, { useRef, useEffect, useCallback, useState } from "react";
import Peer from "peerjs";
import useStageMode from "./hooks/useStageMode";

const Host = () => {
  const {
    mode,
    handleInitialize,
    handleClientConnected,
    handleClientReady,
    handleRoundStart,
    handleRoundEnd,
    handleMatchEnd,
  } = useStageMode();

  const [peerId, setPeerId] = useState("");
  const [dataConnection, setDataConnection] = useState(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    if (mode === "INITIALIZE") {
      peerInstance.current = new Peer();

      peerInstance.current.on("open", (id) => {
        setPeerId(id);
        handleInitialize();
      });

      peerInstance.current.on("connection", (conn) => {
        setDataConnection(conn);
        handleClientConnected();

        conn.on("open", () => {
          handleClientReady();
        });

        conn.on("close", () => {
          setDataConnection(null);
        });

        conn.on("data", (data) => {
          // Handle data received from client
          console.log("Received data from client:", data);
        });

        conn.on("error", (err) => {
          console.error("Connection error:", err);
        });
      });

      peerInstance.current.on("disconnected", () => {
        handleMatchEnd();
      });

      peerInstance.current.on("error", (err) => {
        console.error("Peer error:", err);
      });
    }
  }, [
    mode,
    handleInitialize,
    handleClientConnected,
    handleClientReady,
    handleMatchEnd,
  ]);

  const startRound = useCallback(() => {
    if (dataConnection) {
      dataConnection.send({ action: "startRound" });
      handleRoundStart();
    }
  }, [dataConnection, handleRoundStart]);

  const endRound = useCallback(() => {
    if (dataConnection) {
      dataConnection.send({ action: "endRound" });
      handleRoundEnd();
    }
  }, [dataConnection, handleRoundEnd]);

  return (
    <div className="host-container">
      <p>Host Peer ID: {peerId}</p>
      {mode === "READY" && (
        <>
          <button onClick={startRound}>Start Round</button>
          <button onClick={endRound}>End Round</button>
        </>
      )}
    </div>
  );
};

export default Host;
