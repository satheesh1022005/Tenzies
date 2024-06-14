import React from "react";
import axios from "axios";
import "./scores.css";
function Scores({id}){
    console.log(id);
    const[score,setScore]=React.useState([]);
    React.useEffect(()=>{
        const scores=async()=>{
            try{
                const res=await axios.get(`http://localhost:8800/data?id=${id}`);
                setScore(res.data);
            }
            catch(err){
                console.log(err);
            }
        }
        scores();
        // fetch("http://localhost:8800/data")
        //     .then(res=>res.json())
        //     .then(data=>setScores(data));
        // console.log(scores);
    },[])
    console.log(score);
    return(<div className="scores-container"> {/* Add the container class */}
    <div className="scores-container"> {/* Add the container class */}
      {score.map((val, index) => (
        val.score != 0 && (
          <section key={index} className="score-section"> {/* Add the section class */}
            <div>
              <h5>{val.username}</h5>
              <h5 className="score-value">{val.score}</h5> {/* Add the score value class */}
            </div>
          </section>
        )
      ))}
    </div>
  </div>
    );
}
export default Scores;