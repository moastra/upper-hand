import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/FindMatch.css'; // Import the CSS file

const FindMatch = () => {
  const [lobbies, setLobbies] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/lobbies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLobbies(response.data);
        console.log('response.data = =', response.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="find-match-container">
      <h2>Available Game Lobbies</h2>

      {/* Table to display available lobbies */}
      <table className="match-history-table">
        <thead>
          <tr>
            <th>Peer ID</th>
            <th>Host Name</th>
            <th>Date Posted</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length > 0 ? (
            lobbies.map((lobby, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/localgame?peerId=${lobby.peerId}`}>
                    {lobby.peerId}
                  </Link>
                </td>
                <td>{lobby.username}</td>
                <td>{new Date(lobby.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-lobbies">No open lobbies found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FindMatch;
