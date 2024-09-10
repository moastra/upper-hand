import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { fetchCustomizationData } from "./utility/fetchCustomizeData";

const LobbyChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomizationData();
        const { name } = data;
        setUser(name);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const formattedMessage = `${user.username}: ${message}`;
      socket.emit("chatMessage", formattedMessage);
      setMessage("");
    }
    console.log(user);
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div>
      <div className="chat-section">
        <h3>Global Chat</h3>
        <div className="messages">
          {messages.map((msg, index) => {
            const [username, ...msgParts] = msg.split(": ");
            const messageText = msgParts.join(": ");
            return (
              <p key={index}>
                <strong>{username}</strong>: {messageText}
              </p>
            );
          })}
        </div>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default LobbyChat;
