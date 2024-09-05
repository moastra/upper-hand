// Export the mapping of gestures to choices
const gestureToChoice = {
  Closed_Fist: "Rock",
  Open_Palm: "Paper",
  Victory: "Scissors",
};

export default gestureToChoice;

// Function to determine the winner of the game
export const determineWinner = (localChoice, remoteChoice) => {
  if (localChoice === remoteChoice) {
    return "Draw";
  }

  switch (localChoice) {
    case "Rock":
      return remoteChoice === "Scissors" ? "Win" : "Lose";
    case "Paper":
      return remoteChoice === "Rock" ? "Win" : "Lose";
    case "Scissors":
      return remoteChoice === "Paper" ? "Win" : "Lose";
    default:
      return "Invalid Choice";
  }
};
