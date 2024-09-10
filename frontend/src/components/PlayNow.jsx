import { Link } from "react-router-dom";
// import '../styles/PlayNow.css';
import '../styles/Common.css';

const PlayNow = () => {
  return (
    <div className="heading-container">
      <h2>Play Now</h2>
      <div className="buttons-container">
        <Link to="/findmatch">Find Match</Link>
        <Link to="/localgame">Local Game</Link>
        <Link to="/matchhistory">Match History</Link>
      </div>
    </div>
  );
};

export default PlayNow;
