import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload(); //refreshes page when logging out.
  };

  return (
    <div>
      <h2>Nav Componnents</h2>
      <Link to="/dashboard">Dashboard </Link>
      <br />

      {!token ? (
        <>
          <Link to="/login">Login </Link>
          <br />
          <Link to="/register">Register </Link>
          <br />
        </>
      ) : (
        <>
          <p>
            Logged in as: <strong>{username}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
          <br />
        </>
      )}

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default Nav;
