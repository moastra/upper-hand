import React, { useState } from 'react';
import "../styles/SetAvatar.css"

const SetAvatar = () => {
  const avatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    //we can add more as needed
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [successdMessage, setSuccessMessage] = useState("");

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSave = () => {
    setSuccessMessage(`Avatar "${selectedAvatar}" is selected!`)  //to be changed to axios post request!
  }
  
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
            <img src={`/path/to/avatars/${avatar}`} alt={`Avatar ${index +1}`} />
          </div>
        ))}
      </div>

        {selectedAvatar && (
          <div>
            <p>Selected Avatar: {selectedAvatar}</p>
            <button onClick={handleSave}>Save Avatar</button>
          </div>
        )}

      {successdMessage && <p style={{ color: 'green' }}>{successdMessage}</p>}
    </div>
  );
};


export default SetAvatar;
