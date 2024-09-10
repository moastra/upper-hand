import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MatchHistory.css";

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("match_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const decodedToken = JSON.parse(atob(token.split(".")[1]));

        const extractedUsername = decodedToken.username;

        setUsername(extractedUsername);

        const response = await axios.get("/api/matchhistory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Matches:", response.data);

        setMatches(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching match history:", error);
        setIsLoading(false);
      }
    };

    fetchMatchHistory();
  }, []);

  const handleSort = (column) => {
    let order = "asc";
    if (sortColumn === column && sortOrder === "asc") {
      order = "desc";
    }
    setSortColumn(column);
    setSortOrder(order);

    // Sort the matches array based on the column and order
    const sortedMatches = [...matches].sort((a, b) => {
      if (column === "match_id") {
        return order === "asc" ? a.id - b.id : b.id - a.id;
      } else if (column === "match_date") {
        return order === "asc"
          ? new Date(a.match_date) - new Date(b.match_date)
          : new Date(b.match_date) - new Date(a.match_date);
      }
      return 0;
    });

    setMatches(sortedMatches);
  };

  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winner === username).length; // Matches where the user is the winner
  const losses = matches.filter((match) => match.loser === username).length; // Matches where the user is the loser
  const winRate = totalMatches ? ((wins / totalMatches) * 100).toFixed(2) : 0;

  if (isLoading) {
    return <p>Loading Match History...</p>;
  }

  return (
    <div className="match-history-container">
      <h2>Match History</h2>
      <table className="match-history-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("match_id")}>
              Match ID{" "}
              {sortColumn === "match_id"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th>Winner</th>
            <th>Loser</th>
            <th>Rounds</th>
            <th onClick={() => handleSort("match_date")}>
              Date{" "}
              {sortColumn === "match_date"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.length > 0 ? (
            matches.map((match) => (
              <tr key={match.id}>
                <td>{match.id}</td>
                <td>{match.winner}</td>
                <td>{match.loser}</td>
                <td>{match.rounds}</td>
                <td>{new Date(match.match_date).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No match history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="match-stats">
        <h3>Statistics</h3>
        <p>Total Matches Played: {totalMatches}</p>
        <p>Total Wins: {wins}</p>
        <p>Total Losses: {losses}</p>
        <p>Win Rate: {winRate}%</p>
      </div>
    </div>
  );
};

export default MatchHistory;
