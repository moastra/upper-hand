import { Link } from "react-router-dom";
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-buttons">
        <Link to="/playnow">Play Now</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/customize">Customize</Link>
      </div>
    </div>
  );
};

export default Dashboard;
