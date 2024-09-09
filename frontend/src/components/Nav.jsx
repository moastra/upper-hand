import { Link, useNavigate } from "react-router-dom";
import '../styles/Nav.css';
import logo from './logo.png'

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
    <header className="nav-container">
      <Link to="/">
        <img src={logo} alt="Logo" className="nav-logo" />
      </Link>
      <div className="nav-title">Upper Hand</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div className="user-info">
            <p>
              Logged in as: <strong>{username}</strong>
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </header>
  );
};

export default Nav;
