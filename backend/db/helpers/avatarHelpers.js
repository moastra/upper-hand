const avatarHelpers = (db) => {
  const getAvatarById = async (userId) => {
    const avatar = await db.query("SELECT avatar FROM users WHERE ID = $1", [
      userId,
    ]);

    const avatarRecord = avatar.rows[0];
    console.log("avatar records;", avatarRecord);
    return avatarRecord;
  };

  const updateAvatar = async (userId, avatar) => {
    const updateAvatar = await db.query(
      "UPDATE users SET avatar = $1 WHERE users.id = $2",
      [avatar, userId]
    );

    return updateAvatar;
  };

  return {
    getAvatarById,
    updateAvatar
  };
};

module.exports = avatarHelpers;