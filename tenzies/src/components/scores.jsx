import React from "react";
import axios from "axios";
import "./scores.css";
import "bootstrap/dist/css/bootstrap.css";

function Scores({ id }) {
  const [score, setScore] = React.useState([]);

  React.useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://tenzies-nv63.onrender.com/scores", {
          headers: { Authorization: token },
        });
        setScore(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="scoreboard-container container-fluid">
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {score.map((val, index) => (
            <tr key={index} className={val.id === id ? "active score-row" : "score-row"}>
              <td>{index + 1}</td>
              <td>{val.username}</td>
              <td className="score-value">{val.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scores;
