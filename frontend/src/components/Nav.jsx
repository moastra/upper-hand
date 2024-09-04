import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  let navigate = useNavigate();
  return (
    <div>
      <h2>Nav Componnents</h2>
      <Link to="/dashboard">Dashboard </Link>
      <br />
      <Link to="/login">Login </Link>
      <br />
      <Link to="/register">Register </Link>
      <br />
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default Nav;
