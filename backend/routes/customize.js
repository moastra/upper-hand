const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const customize = (customizeHelpers) => {
  router.get("/customize", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      const name = await customizeHelpers.getUsernameById(userId);
      const stats = await customizeHelpers.getUserStats(userId);
      const powerUps = await customizeHelpers.getUserPowerUps(userId);
      const storage = await customizeHelpers.getUserStorage(userId);

      return res.status(200).json({ name, stats, powerUps, storage });
    } catch (error) {
      console.error("Error fetching customization data:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  router.post("/customize", async (req, res) => {
    const { stats, equippedPowerUp } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      await customizeHelpers.updateUserStats(userId, stats);
      await customizeHelpers.updateEquippedPowerUp(userId, equippedPowerUp);

      return res
        .status(200)
        .json({ message: "Customizations saved successfully!" });
    } catch (error) {
      console.error("Error saving customization data:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = customize;
