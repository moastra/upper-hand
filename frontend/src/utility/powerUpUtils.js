const powerUps = {
  1: {
    name: "Health Boost",
    description: "Increases HP by 20%",
    effect: 0.2, // 20% increase
  },
  2: {
    name: "Attack Boost",
    description: "Increases ATK by 15",
    effect: 15, // Increase attack by 15
  },
};

export const applyPowerUp = (setPlayer, powerUpId) => {
  const powerUp = powerUps[powerUpId];

  if (powerUp) {
    setPlayer((prev) => {
      switch (powerUpId) {
        case 1: // Health Boost
          return {
            ...prev,
            hp: prev.hp + prev.hp * powerUp.effect, // Increase HP by 20%
          };
        case 2: // Attack Boost
          return {
            ...prev,
            attack: prev.attack + powerUp.effect, // Increase attack by 15
          };
        default:
          return prev;
      }
    });
  }
};

// Function to get power-up details
export const getPowerUpDetails = (powerUpId) =>
  powerUps[powerUpId] || { name: "None", description: "No power-up active" };

// PowerUpInfo Component
const PowerUpInfo = ({ player }) => {
  // Destructure player properties and get power-up details
  const { powerUp } = player;
  const { name, description } = getPowerUpDetails(powerUp);

  return (
    <div className="power-up">
      <h3>{player.name} Power-Up</h3>
      <p>
        <strong>{name}</strong>
      </p>
      <p>{description}</p>
    </div>
  );
};
export default PowerUpInfo;
