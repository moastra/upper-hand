import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Privacy.css';
import { fetchCustomizationData } from "../utility/fetchCustomizeData";

const Privacy = () => {
  const [webcam, setWebcam] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomizationData();
        const { avatar } = data;
        setAvatar(avatar);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

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
    <div className="privacy-settings">
      <h2>Privacy Settings</h2>
      <div>
        <label className="use-webcam">
          <input
            type="checkbox"
            checked={webcam}
            onChange={handleWebcamChange}
          />
          <strong>Use Webcam?</strong>
        </label>
      </div>
      {!webcam && (
        <div className="webcam-off">
          <img
            src={`/avatars/${avatar}`}
            alt="Avatar"
            width="100"
            height="100"
          />
          <p>
            You currently have the webcam off. You avatar will be displayed
            instead:
          </p>
        </div>
      )}
      <button onClick={handleSave}>Save</button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Privacy;
