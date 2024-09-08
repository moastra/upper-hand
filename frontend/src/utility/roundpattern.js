export const checkPatterns = (counts, setPlayer, appliedPatterns) => {
  const values = Object.values(counts);
  const pair = values.includes(2);
  const threeOfAKind = values.includes(3);
  const fourOfAKind = values.includes(4);
  const fullHouse = values.includes(3) && values.includes(2);

  // Initialize an empty set if not provided
  appliedPatterns = appliedPatterns || new Set();

  const updatedPatterns = new Set(appliedPatterns);

  if (pair && !updatedPatterns.has("pair")) {
    setPlayer((prev) => ({
      ...prev,
      attack: prev.attack + 5,
    }));
    updatedPatterns.add("pair");
  }

  if (threeOfAKind && !updatedPatterns.has("threeOfAKind")) {
    setPlayer((prev) => ({
      ...prev,
      attack: prev.attack * 1.5,
    }));
    updatedPatterns.add("threeOfAKind");
  }

  if (fourOfAKind && !updatedPatterns.has("fourOfAKind")) {
    setPlayer((prev) => ({
      ...prev,
      attack: prev.attack * 2,
    }));
    updatedPatterns.add("fourOfAKind");
  }

  if (fullHouse && !updatedPatterns.has("fullHouse")) {
    setPlayer((prev) => ({
      ...prev,
      attack: prev.attack * 3,
    }));
    updatedPatterns.add("fullHouse");
  }

  return updatedPatterns;
};
