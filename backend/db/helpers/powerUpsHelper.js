const powerUpsHelper = (db) => {
  const getPowerUps = async () => {
    try {
      const powerUps = await db.query("SELECT * FROM power_ups");
      console.log("fetching powerup", powerUps.rows);
      return powerUps.rows;
    } catch (error) {
      console.error("Error fetching power-ups:", error);
      throw error; // Re-throw error to be handled by route
    }
  };
  return { getPowerUps };
};

module.exports = powerUpsHelper;
