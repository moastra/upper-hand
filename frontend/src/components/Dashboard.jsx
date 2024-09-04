import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard Componnents</h2>
      <Link to="/playnow">Play Now </Link>
      <br />
      <Link to="/settings">Settings </Link>
      <br />
      <Link to="/customize">Customize </Link>
    </div>
  );
};

export default Dashboard;
