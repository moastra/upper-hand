import React, { useEffect, useState } from "react";
import { fetchCustomizationData } from "../utility/fetchCustomizationData";

const PlayerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomizationData();
        setStats(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log("");
  return (
    <div>
      <h1>Player Stats</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      {/* Customize this to display stats as needed */}
    </div>
  );
};

export default PlayerStats;
