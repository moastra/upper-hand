import { Outlet } from 'react-router-dom'
import Chat from '../Chat'

const ChatVideo = () => {
  return (
    <div>
      <h2>Chat Layout Componnents</h2>
      <Outlet />
      <Chat />
    </div>
  );
};

export default ChatVideo;
