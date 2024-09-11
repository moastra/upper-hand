const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const hostLobby = [];

const lobbies = () => {
  router.post('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('token info stuff:', req.headers.authorization);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;
      console.log("userId ===", userId);

      const username = decoded.username
      console.log("username ===", username);

      const peerId = req.body.peerId
      console.log("peerId ===", peerId);

      hostLobby.push({userId, username, peerId, createdAt: new Date()});

      res.status(200).json({ message: "It worked!" })
    } catch (error) {
      console.error(error);
    }
  })
  router.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('token info stuff:', req.headers.authorization);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    res.status(200).json(hostLobby);
  })


  return router;
}

module.exports = lobbies;