import React, { useEffect, useState } from "react";
import axios from "axios";

const Privacy = () => {
  const [webcam, setWebcam] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/privacy");
        setWebcam(response.data.webcam);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleWebcamChange = (e) => {
    setWebcam(e.target.checked);
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/privacy", { webcam });
      setSuccessMessage("Privacy settings updated successfully!");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
    }
  };

  return (
    <div>
      <h2>Privacy Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={webcam}
            onChange={handleWebcamChange}
          />
          Use Webcam?
        </label>
      </div>
      {!webcam && (
        <div>
          <p>
            You currently have the webcam off. You avatar will be displayed
            instead:
          </p>
          <img
            src={`/path/to/avatars/${avatar}`}
            alt="Avatar"
            width="100"
            height="100"
          />
        </div>
      )}
      <button onClick={handleSave}>Save</button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Privacy;
