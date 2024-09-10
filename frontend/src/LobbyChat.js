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
        console.log("error");
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
      socket.emit("chatMessage", message);
      setMessage("");
    }
    console.log(user.username);
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
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
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

// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.on('chatMessage', (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off('chatMessage');
//     };
//   }, []);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       socket.emit('chatMessage', message);
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       <div>
//         <h2>Chat</h2>
//         <div>
//           {messages.map((msg, index) => (
//             <div key={index}>{msg}</div>
//           ))}
//         </div>
//       </div>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default Chat;

// Prob make as layout and then bring in children for which it concerns
