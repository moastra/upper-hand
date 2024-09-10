import React from 'react';

const FindMatch = ({ lobbies }) => {
  return (
    <div>
      <h2>Available Game Lobbies</h2>

      {/* Table to display available lobbies */}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Peer ID</th>
            <th>Host Name</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length > 0 ? (
            lobbies.map((lobby, index) => (
              <tr key={index}>
                <td>{lobby.peerId}</td>
                <td>{lobby.hostName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No open lobbies found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FindMatch;
