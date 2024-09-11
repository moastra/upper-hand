import React, { useState } from 'react';
// import { avatar } from '../avatars'
import "../styles/SetAvatar.css"
import axios from 'axios';

const SetAvatar = (props) => {
  const avatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    //we can add more as needed
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // const handleAvatarSelect = (avatar) => {
  //   setSelectedAvatar(avatar);
  // };

  // const handleSave = () => {
  //   setSelectedAvatar(avatar);
  //   setSuccessMessage(`Avatar "${selectedAvatar}" is selected!`)  //to be changed to axios post request!
  // }

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setSuccessMessage(""); // Reset success message on selection
  };

  // Handle save action
  const handleSave = async () => {
    if (selectedAvatar) {
      try {
        const token = localStorage.getItem("token"); // Assuming you use JWT for authentication
        const response = await axios.post("/api/setAvatar", 
          { avatar: selectedAvatar }, 
          { headers: { Authorization: `Bearer ${token}` } } // Add auth token if needed
        );
        
        // Show success message based on response
        if (response.status === 200) {
          setSuccessMessage(`Avatar "${selectedAvatar}" is selected and saved!`);
        }
      } catch (error) {
        setSuccessMessage("Error saving avatar. Please try again.");
        console.error("Error saving avatar:", error);
      }
    } else {
      setSuccessMessage("Please select an avatar before saving.");
    }
  };
  
  return (
    <div>
      <h2>Select an Avatar</h2>
      
      <div className='avatar-grid'>
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-item ${selectedAvatar === avatar ? 'selected' : ""}`}
            onClick={() => handleAvatarSelect(avatar)}
          >
            <img src={`/avatars/${avatar}`} alt={`Avatar ${index +1}`} />
          </div>
        ))}
      </div>

        {selectedAvatar && (
          <div>
            <p>Selected Avatar: {selectedAvatar}</p>
            <button onClick={handleSave}>Save Avatar</button>
          </div>
        )}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};


export default SetAvatar;
