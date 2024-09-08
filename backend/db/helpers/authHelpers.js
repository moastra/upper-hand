const authHelpers = (db) => {
  
  const getUserByEmail = async (email) => {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      throw new Error("User not found");
    }

    const userRecord = user.rows[0];
    return userRecord;
  };

  const getUserByUsername = async (username) => {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!user.rows.length) {
      throw new Error("User not found");
    }

    const userRecord = user.rows[0];
    console.log("user records;", userRecord);
    return userRecord;
  };

  const createNewUser = async ({
    username,
    hashedPassword,
    email,
    avatar,
    webcam,
  }) => {
    const newUser = await db.query(
      "INSERT INTO users (username, password, email, avatar, webcam) VALUES ($1, $2, $3, $4, $5) RETURNING id, username",
      [username, hashedPassword, email, avatar, webcam]
    );

    return newUser.rows[0];
  };

  return {
    getUserByEmail,
    getUserByUsername,
    createNewUser,
  };
};

module.exports = authHelpers;
