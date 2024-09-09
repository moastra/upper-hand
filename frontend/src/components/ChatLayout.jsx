import { Outlet } from 'react-router-dom'
import LobbyChat from '../LobbyChat';


const ChatVideo = () => {
  return (
    <div>
      <LobbyChat />
      <h2>Chat Layout Componnents</h2>
      <Outlet />
    </div>
  );
};

export default ChatVideo;
