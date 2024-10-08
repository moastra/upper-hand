const customizeHelpers = (db) => {
  const getUserStats = async (userId) => {
    const stats = await db.query(
      "SELECT user_id, hp, atk, def FROM stats WHERE user_id = $1",
      [userId]
    );

    if (!stats.rows.length) {
      throw new Error("User stats not found");
    }

    return stats.rows[0];
  };

  const getUsernameById = async (userId) => {
    const user = await db.query("SELECT username FROM users WHERE ID = $1", [
      userId,
    ]);

    if (!user.rows.length) {
      throw new Error("User not found");
    }

    const userRecord = user.rows[0];
    console.log("user records;", userRecord);
    return userRecord;
  };

  const getAvatarById = async (userId) => {
    const avatar = await db.query("SELECT avatar FROM users WHERE ID = $1", [
      userId,
    ]);

    const avatarRecord = avatar.rows[0].avatar;
    console.log("avatar records;", avatarRecord);
    return avatarRecord;
  };

  const getUserPowerUps = async (userId) => {
    // active powerup
    const powerUps = await db.query(
      `SELECT pu.id, pu.name, pu.description, pu.effect, pu.value
      FROM power_ups pu
      JOIN storages s ON s.power_up_id = pu.id
      WHERE s.user_id = $1 AND s.active = TRUE`,
      [userId]
    );

    return powerUps.rows;
  };

  const getUserStorage = async (userId) => {
    const storage = await db.query(
      `SELECT pu.id, pu.name, pu.description, pu.effect, pu.value
      FROM power_ups pu
      JOIN storages s ON s.power_up_id = pu.id
      WHERE s.user_id = $1`,
      [userId]
    );

    return storage.rows;
  };

  const updateUserStats = async (userId, { hp, atk, def }) => {
    const updateStats = await db.query(
      "UPDATE stats SET hp = $1, atk = $2, def = $3 WHERE user_id = $4",
      [hp, atk, def, userId]
    );

    return updateStats;
  };

  const updateEquippedPowerUp = async (userId, powerUpId) => {
    await db.query("UPDATE storages SET active = FALSE WHERE user_id = $1", [
      userId,
    ]);

    const updatePowerUp = await db.query(
      `UPDATE storages 
       SET active = TRUE 
       WHERE user_id = $1 
       AND power_up_id = $2`,
      [userId, powerUpId]
    );

    return updatePowerUp;
  };

  return {
    getAvatarById,
    getUsernameById,
    getUserStats,
    getUserPowerUps,
    getUserStorage,
    updateUserStats,
    updateEquippedPowerUp,
  };
};

module.exports = customizeHelpers;
