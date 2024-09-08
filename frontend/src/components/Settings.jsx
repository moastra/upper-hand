import { Link } from "react-router-dom";

const Settings = () => {

  return (
    <div>
      <h2>Settings Componnents</h2>
      <Link to="/setavatar">Set Avatar </Link>
      <br />
      <Link to="/accountdetails">Account Details </Link>
      <br />
      <Link to="/privacy">Privacy </Link>
    </div>
  );

};

export default Settings;