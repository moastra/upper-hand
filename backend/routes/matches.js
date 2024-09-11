const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const matches = (matchHelpers) => {
  router.get("/matchhistory", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      const matchHistory = await matchHelpers.getMatchHistoryByUserId(userId);

      res.status(200).json(matchHistory);
    } catch (error) {
      console.error("Error fetching match history:", error);
      res.status(500).json({ message: error.message });
    }
  });
  // Route to update match history
  router.post("/matchhistory", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      // Extract match data from the request body
      const { winnerId, loserId, rounds, matchDate } = req.body;

      if (!winnerId || !loserId || !rounds) {
        return res
          .status(400)
          .json({ message: "Bad Request: Missing required fields" });
      }

      // Add the user ID to the match data if necessary
      const match = {
        winnerId,
        loserId,
        rounds,
        // matchDate: matchDate || new Date().toISOString(), // Use current date if not provided
      };

      // Insert the new match record
      const matchId = await matchHelpers.updateMatchHistoryByUserId(match);

      res
        .status(201)
        .json({ message: "Match record created successfully", matchId });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
      } else if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Unauthorized: Token expired" });
      } else {
        console.error("Error updating match history:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
  return router;
};

module.exports = matches;
