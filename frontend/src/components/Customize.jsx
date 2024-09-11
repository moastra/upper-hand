import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Customize.css";

const Customize = () => {
  const [stats, setStats] = useState(null);
  const [skillPoints, setSkillPoints] = useState(1);
  const [powerUps, setPowerUps] = useState([]);
  const [storage, setStorage] = useState([]);
  const [equippedPowerUp, setEquippedPowerUp] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/customize", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { stats, powerUps, storage } = response.data;
        setStats({ hp: stats.hp, atk: stats.atk, def: stats.def });
        setPowerUps(powerUps[0]);
        setStorage(storage);

        if(powerUps.length > 0){
        setEquippedPowerUp(powerUps[0]);
        }

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleStatUpgrade = (stat) => {
    if (skillPoints > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [stat]: prevStats[stat] + 1, //stat upgrade +1
      }));
      setSkillPoints(skillPoints - 1);
    }
  };

  const handleEquipPowerUp = (powerUp) => {
    setEquippedPowerUp(powerUp);
  };
  if (equippedPowerUp) {
    console.log("equip power", equippedPowerUp);
  }
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/customize",
        {
          stats,
          storage,
          equippedPowerUp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Customizations saved successfully!");
    } catch (error) {
      console.error("Error saving customizations:", error);
    }
  };

  return (
    <div className="customize-container">
      <h2>Customize</h2>
      <p>Here, you can see your stats and modify your power-ups!</p>

      {/* loading before stats fully render */}

      {!stats ? (
        <p>Loading stats...</p>
      ) : (
        <>
          {/* Unused Skill Points */}
          <div className="skill-points">
            <p>({skillPoints}) Unused Skill Point</p>
          </div>

          {/* My Item Section */}
          <div className="item-section">

            <div className="equipped-item">
              {equippedPowerUp ? (
                <div>
                  <h2>Selected Power-Up</h2>
                  <p>
                   <strong>{equippedPowerUp.name}</strong>
                  </p>
                  <p>
                   <strong>{equippedPowerUp.description}</strong>
                  </p>
                </div>
              ) : (
                <p> No power-ups equipped</p>
              )}
            </div>
          </div>


          {/* Stats Table */}
          <div className="stats-section">
            <h3>My Stats</h3>
            <table>
              <tbody>
                {Object.keys(stats).map((stat) => (
                  <tr key={stat}>
                    <td>{stat.charAt(0).toUpperCase() + stat.slice(1)}</td>
                    <td>{stats[stat]}</td>
                    <td>
                      <button
                        onClick={() => handleStatUpgrade(stat)}
                        disabled={skillPoints === 0}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Storage Section */}
          <div className="storage-section">
            <h3>Storage</h3>
            <table>

              <tbody>
                <tr>
                {storage.map((powerup, index) => (
                  <td key={index}>
                    <p 
                    onClick={() => handleEquipPowerUp(powerup)}
                    className="storage-item"
                    style={{cursor: "pointer"}}
                    >{powerup.name}<br />
                    {powerup.description}
                    </p>
                  </td>
                ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          <button onClick={handleSaveChanges}>Save Changes</button>

          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Customize;
