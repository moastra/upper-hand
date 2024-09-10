import { Link } from "react-router-dom";
import '../styles/PlayNow.css'; // Import the CSS file

const PlayNow = () => {
  return (
    <div className="playnow-container">
      <h2>Play Now</h2>
      <div className="playnow-buttons">
      <Link to="/findmatch">Find Match </Link>
      <br />
      <Link to="/localgame">Local Game </Link>
      <br />
      <Link to="/matchhistory">Match History</Link>
    </div>
    </div>
  );
};

export default PlayNow;
