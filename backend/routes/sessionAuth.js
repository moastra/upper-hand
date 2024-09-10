const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //outside packages good, dont need to import code we wrote, inject it.

const SECRET_KEY = process.env.SECRET_KEY;

const sessionAuth = (authHelpers) => {
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const userRecord = await authHelpers.getUserByEmail(email);

      const isMatch = await bcrypt.compare(password, userRecord.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid username or password " });
      }

      //JWT token
      const token = jwt.sign(
        { userId: userRecord.id, username: userRecord.username },
        SECRET_KEY,
        {
          expiresIn: "5h",
        }
      );

      return res.status(200).json({ token, username: userRecord.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/register", async (req, res) => {
    const { username, email, password, avatar, webcam } = req.body;

    try {
      // Check if the email already exists
      try {
        const existingUser = await authHelpers.getUserByEmail(email);

        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
      } catch (error) {
        //No error - email not in use - do not worry
      }

      try {
        const existingUsername = await authHelpers.getUserByUsername(username);

        if (existingUsername) {
          return res.status(400).json({ message: "Username already in use" });
        }
      } catch (error) {
        // no error - username not in use
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the database
      const insertQueryResult = await authHelpers.createNewUser({
        username,
        hashedPassword,
        email,
        avatar,
        webcam,
      });

      const token = jwt.sign(
        { userId: insertQueryResult.id, username: userRecord.username },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      //add jwt.verify? - for secret adminny stuff

      return res
        .status(201)
        .json({ token, username: insertQueryResult.username });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  router.post("/loginregister", async (req, res) => {
    const { action, username, email, password, avatar, webcam } = req.body;

    try {
      if (action === "login") {
        // Handle login
        const userRecord = await authHelpers.getUserByEmail(email);

        const isMatch = await bcrypt.compare(password, userRecord.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: userRecord.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token, username: userRecord.username });
      } else if (action === "register") {
        // Handle registration
        try {
          const existingUser = await authHelpers.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
          }
        } catch (error) {
          // No error - email not in use - proceed
        }

        try {
          const existingUsername = await authHelpers.getUserByUsername(
            username
          );
          if (existingUsername) {
            return res.status(400).json({ message: "Username already in use" });
          }
        } catch (error) {
          // No error - username not in use - proceed
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQueryResult = await authHelpers.createNewUser({
          username,
          hashedPassword,
          email,
          avatar,
          webcam,
        });

        const token = jwt.sign({ userId: insertQueryResult.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        return res
          .status(201)
          .json({ token, username: insertQueryResult.username });
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = sessionAuth;
