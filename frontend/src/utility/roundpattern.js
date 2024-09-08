export const checkPatterns = (counts, setPlayer, appliedPatterns) => {
  const values = Object.values(counts);
  const threeOfAKind = values.includes(3);
  const fourOfAKind = values.includes(4);
  const fullHouse = values.includes(3) && values.includes(2);
  const rockSolid = counts.Rock === 2; // Check if Rock was chosen 2 times
  const secondWind = counts.Paper === 2;
  const cuttingEdge = counts.Scissors === 2;
  appliedPatterns = appliedPatterns || new Set();

  const updatedPatterns = new Set(appliedPatterns);
  const patternMessages = [];

<<<<<<< HEAD
  // Note: 'prev' needs to be available in the updatePlayer function
  // You can't directly use 'prev' outside of the updatePlayer function
=======

>>>>>>> 0b36e9b4f2096e951596d52f9673066f61147ae8

  if (rockSolid && !updatedPatterns.has("rockSolid")) {
    setPlayer((prev) => ({
      ...prev,
      defense: prev.defense + 10,
    }));
    updatedPatterns.add("rockSolid");
    patternMessages.push("rockSolid: Defense increased by 10");
  }
  if (secondWind && !updatedPatterns.has("secondWind")) {
    setPlayer((prev) => ({
      ...prev,
      hp: prev.hp + 15,
    }));
    updatedPatterns.add("secondWind");
    patternMessages.push("secondWind: hp increased by 15");
  }
  if (cuttingEdge && !updatedPatterns.has("cuttingEdge")) {
    setPlayer((prev) => ({
      ...prev,
      attack: prev.attack + 10,
    }));
    updatedPatterns.add("cuttingEdge");
    patternMessages.push("cuttingEdge: attack increased by 10");
  }

  if (threeOfAKind && !updatedPatterns.has("threeOfAKind")) {
    setPlayer((prev) => ({
      ...prev,
      multiplier: 1.5,
    }));
    updatedPatterns.add("threeOfAKind");
    patternMessages.push("Three of a Kind: Attack multiplied by 1.5");
  }

  if (fourOfAKind && !updatedPatterns.has("fourOfAKind")) {
    setPlayer((prev) => ({
      ...prev,
      multiplier: 2,
    }));
    updatedPatterns.add("fourOfAKind");
    patternMessages.push("Four of a Kind: Attack multiplied by 2");
  }

  if (fullHouse && !updatedPatterns.has("fullHouse")) {
    setPlayer((prev) => ({
      ...prev,
      multiplier: 3,
    }));
    updatedPatterns.add("fullHouse");
    patternMessages.push("Full House: Attack multiplied by 3");
  }

  return {
    updatedPatterns,
    patternMessages,
  };
};
