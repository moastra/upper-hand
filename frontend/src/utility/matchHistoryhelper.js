import axios from "axios";

//saving the match history
export const sendMatchHistory = async (match) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post("/api/matchhistory", match, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Match history updated successfully");
  } catch (error) {
    console.error("Error updating match history:", error);
  }
};
