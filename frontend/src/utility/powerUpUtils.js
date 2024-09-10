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
  3: {
    name: "Defense Boost",
    description: "Increases DEF by 10",
    effect: 10,
  },
};

export const applyPowerUp = (player, powerUpId) => {
  const powerUp = powerUps[powerUpId];

  if (!powerUp) return player;

  switch (powerUpId) {
    case 1: // Health Boost
      return {
        ...player,
        hp: player.hp + player.hp * powerUp.effect, // Increase HP by percentage
      };
    case 2: // Attack Boost
      return {
        ...player,
        attack: player.attack + powerUp.effect, // Increase attack by amount
      };
    case 3: // Defense Boost
      return {
        ...player,
        defense: player.defense + powerUp.effect, // Increase defense by amount
      };
    default:
      return player;
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
      <h3>Power-Up</h3>
      <p>
        <strong>{name}</strong>
      </p>
      <p>{description}</p>
    </div>
  );
};
export default PowerUpInfo;
