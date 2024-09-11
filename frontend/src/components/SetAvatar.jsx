import React, { useState } from 'react';
// import { avatar } from '../avatars'
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
  const handleSave = () => {
    if (selectedAvatar) {
      setSuccessMessage(`Avatar "${selectedAvatar}" is selected!`);
      // This is where you'd send the selected avatar to the backend via an Axios POST request.
      // axios.post("/api/saveAvatar", { avatar: selectedAvatar }).then(response => console.log(response))
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
