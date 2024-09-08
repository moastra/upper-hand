export const updatePlayerHP = (hp, attack, defense, multiplier) => {
  // Calculate raw damage
  const rawDamage = attack * multiplier - defense;

  // Ensure damage is non-negative
  const damage = Math.max(rawDamage, 0);

  // Update HP based on the calculated damage
  return Math.max(hp - damage, 0);
};
