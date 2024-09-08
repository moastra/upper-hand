import { Link } from "react-router-dom";

const PlayNow = () => {
  return (
    <div>
      <h2>Play Now Componnents</h2>
      <Link to="/findmatch">Find Match </Link>
      <br />
      <Link to="/localgame">Local Game </Link>
    </div>
  );
};

export default PlayNow;
