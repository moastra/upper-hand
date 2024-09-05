import rock from "../image/rock.png";
import paper from "../image/paper.png";
import scissors from "../image/scissors.png";
// Export the mapping of gestures to choices
const gestureToChoice = {
  Closed_Fist: { choice: "Rock", image: rock },
  Open_Palm: { choice: "Paper", image: paper },
  Victory: { choice: "Scissors", image: scissors },
};

export default gestureToChoice;

// Function to determine the winner of the game
export const determineWinner = (localChoice, remoteChoice) => {
  if (localChoice === "Invalid" || remoteChoice === "Invalid") {
    return "Invalid Choice";
  }
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
