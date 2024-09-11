var express = require('express');
var router = express.Router();
// const avatarHelpers = require("../db/helpers/avatarHelpers")
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const avatar = (avatarHelpers) => {
  router.post('/', (req, res) => {
    const { avatar } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    console.log('token info stuff:', req.headers.authorization);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    // Save avatar to the database
    // return res.send("Yay");
    avatarHelpers.updateAvatar(userId, avatar)
      .then(() => res.status(200).send('Avatar updated successfully'))
      .catch(error => {
        console.log("avatar error: ", error)
        res.status(500).send('Error saving avatar')
      });
  });
  return router;
}

module.exports = avatar;