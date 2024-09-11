import { Outlet } from 'react-router-dom';
import LobbyChat from '../LobbyChat';

const ChatVideo = () => {
  return (
    <div>
      <Outlet />
      <LobbyChat />
    </div>
  );
};

export default ChatVideo;
