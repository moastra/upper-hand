import React, { useState } from "react";
// import '../styles/AccountDetails.css'
import '../styles/Common.css';
import { Link } from "react-router-dom";

const AccountDetails = () => {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Email:", email);
    setIsEmailOpen(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      console.log("Password changed successfully.");
      setIsPasswordOpen(false);
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <div className="heading-container">
      <h2>Account Details</h2>

      {/* Button to toggle email update */}
      <Link onClick={() => setIsEmailOpen(!isEmailOpen)} className="buttons-container">Update Email</Link>

      {/* Email Update Form */}
      {isEmailOpen && (
        <form onSubmit={handleEmailUpdate}>
          <div>
            <label>New Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Link type="submit" className="Link-container">Save Email</Link>
        </form>
      )}

      <br />

      {/* Button to toggle password change */}
      <Link onClick={() => setIsPasswordOpen(!isPasswordOpen)} className="buttons-container">
        Change Password
      </Link>

      {/* Password Change Form */}
      {isPasswordOpen && (
        <form onSubmit={handlePasswordChange}>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Link type="submit" className="buttons-container">Save Password</Link>
        </form>
      )}
    </div>
  );
};

export default AccountDetails;
