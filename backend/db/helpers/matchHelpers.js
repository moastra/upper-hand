const matchHelper = (db) => {
  const getMatchHistoryByUserId = async (userId) => {
    const query = `
    SELECT m.id, u1.username AS winner, u2.username AS loser, m.rounds, m.match_date
    FROM matches m
    JOIN users u1 ON m.winner_id = u1.id
    JOIN users u2 ON m.loser_id = u2.id
    WHERE m.winner_id = $1 OR m.loser_id = $1
    ORDER BY m.match_date DESC;
    `;
    const values = [userId];

    const result = await db.query(query, values);

    return result.rows;
  };

  const updateMatchHistoryByUserId = async (match) => {
    const query = `
  INSERT INTO matches (winner_id, loser_id, rounds)
  VALUES ($1, $2, $3)
  RETURNING id;
  `;
    const values = [match.winnerId, match.loserId, match.rounds];
    try {
      const result = await db.query(query, values);
      return result.rows[0].id; // Return the ID of the newly inserted match
    } catch (error) {
      console.error("Error inserting match record:", error);
      throw new Error("Unable to insert match record");
    }
  };
  return {
    getMatchHistoryByUserId,
    updateMatchHistoryByUserId,
  };
};
module.exports = matchHelper;
