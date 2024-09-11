import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import '../styles/Nav.css';
import logo from './logo.png';
import { fetchCustomizationData } from "../utility/fetchCustomizeData";

const Nav = () => {
  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomizationData();
        const { avatar } = data;
        setAvatar(avatar);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

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
      <div className="nav-title"> <Link to="/">Upper Hand</Link></div>
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
              <b>Logged in as: <strong>{username}</strong></b>
            </p>
            <img
              src={`/avatars/${avatar}`}
              alt="Avatar"
              width="100"
              height="100"
            />
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </header>
  );
};

export default Nav;
