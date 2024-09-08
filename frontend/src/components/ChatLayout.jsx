import { Outlet } from 'react-router-dom'
import LobbyChat from '../LobbyChat';


const ChatVideo = () => {
  return (
    <div>
      <h2>Chat Layout Componnents</h2>
      <Outlet />
      <LobbyChat />
    </div>
  );
};

export default ChatVideo;
