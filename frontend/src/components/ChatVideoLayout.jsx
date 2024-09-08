import { Outlet } from 'react-router-dom'
import Chat from '../Chat'
import Video from '../Video'

const ChatVideo = () => {
  return (
    <div>
      <h2>Chat Video Layout Componnents</h2>
      <Outlet />
      <Chat />
      <Video />

    </div>
  );
};

export default ChatVideo;
