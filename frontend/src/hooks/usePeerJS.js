import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const usePeerJS = (onConnection, onCall) => {
  const [peerId, setPeerId] = useState("");
  const [dataConnection, setDataConnection] = useState(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    peerInstance.current = new Peer();

    const handleOpen = (id) => setPeerId(id);

    const handleConnection = (conn) => {
      setDataConnection(conn);
      conn.on("data", (data) => {
        if (onConnection) onConnection(data);
      });
      conn.on("error", (err) => console.error("Connection error:", err));
    };

    const handleCall = (call) => {
      if (onCall) onCall(call);
    };

    peerInstance.current.on("open", handleOpen);
    peerInstance.current.on("connection", handleConnection);
    peerInstance.current.on("call", handleCall);

    return () => {
      if (peerInstance.current) {
        peerInstance.current.disconnect();
        peerInstance.current.destroy();
      }
    };
  }, [onConnection, onCall]);

  const callPeer = (id, stream) => {
    const call = peerInstance.current.call(id, stream);
    return call;
  };

  const connectPeer = (id) => {
    const conn = peerInstance.current.connect(id);
    setDataConnection(conn);
    return conn;
  };

  return { peerId, callPeer, connectPeer, dataConnection };
};

export default usePeerJS;
