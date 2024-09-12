var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const powerup = (powerUpsHelper) => {
  router.get("/powerup", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      const powerUps = await powerUpsHelper.getPowerUps();
      return res.status(200).json(powerUps);
    } catch (error) {
      console.error("Error fetching power-ups:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = powerup;
