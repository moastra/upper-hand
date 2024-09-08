import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:3001');

const LobbyChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocket(socket);
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
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
