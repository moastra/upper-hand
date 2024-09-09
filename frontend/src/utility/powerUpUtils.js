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

export const getPowerUpDetails = (powerUpId) =>
  powerUps[powerUpId] || { name: "None", description: "No power-up active" };
