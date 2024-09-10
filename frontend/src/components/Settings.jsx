import { Link } from "react-router-dom";
import '../styles/Common.css';

const Settings = () => {

  return (
    <div className="heading-container">
      <h2>Settings</h2>
      <div className="buttons-container">
        <Link to="/setavatar">Set Avatar</Link>
        <Link to="/accountdetails">Account</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
    </div>
  );

};

export default Settings;