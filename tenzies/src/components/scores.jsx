import React from "react";
import axios from "axios";
function Scores(){
    const[score,setScore]=React.useState([]);
    React.useEffect(()=>{
        const scores=async()=>{
            try{
                const res=await axios.get("http://localhost:8800/data");
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
    return(
        <div>
            {score.map((val,index)=>(
                <section key={index}>
                    {val.name}{val.score}
                </section>
            ))}
       </div>
    );
}
export default Scores;