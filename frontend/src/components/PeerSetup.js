import Peer from "peerjs";

export const createPeerInstance = (
  setPeerId,
  setDataConnection,
  setRemoteData
) => {
  const peer = new Peer();

  peer.on("open", (id) => {
    setPeerId(id);
  });

  peer.on("connection", (conn) => {
    setDataConnection(conn);

    conn.on("data", (data) => {
      setRemoteData(data.gestureData);
    });

    conn.on("error", (err) => {
      console.error("Connection error:", err);
    });
  });

  peer.on("call", (call) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          // Handle remote stream
        });
      });
  });

  return peer;
};

export const initiateCall = (
  peer,
  id,
  setLocalStream,
  setRemoteStream,
  setDataConnection
) => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      setLocalStream(stream);

      const call = peer.call(id, stream);
      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      const conn = peer.connect(id);
      conn.on("open", () => {
        setDataConnection(conn);
      });
      conn.on("data", (data) => {
        // Handle received data
      });
      conn.on("error", (err) => {
        console.error("Connection error:", err);
      });
    });
};
