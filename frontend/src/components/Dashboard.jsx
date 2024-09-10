import { Link } from "react-router-dom";
// import '../styles/Dashboard.css';
import '../styles/Common.css';

const Dashboard = () => {
  return (
    <div className="heading-container">
      <h2>Dashboard</h2>
      <div className="buttons-container">
      <Link to="/playnow">Play Now</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/customize">Customize</Link>
      </div>
    </div>
  );
};

export default Dashboard;
