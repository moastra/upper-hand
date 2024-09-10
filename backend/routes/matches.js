const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const matches = (matchHelpers) => {
  router.get('/matchhistory', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      const matchHistory = await matchHelpers.getMatchHistoryByUserId(userId);

      res.status(200).json(matchHistory);
    } catch (error) {
      console.error('Error fetching match history:', error);
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = matches;