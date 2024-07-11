import React from "react";
import Confetti from 'react-confetti'
import Game from "./Game";
import './Game.css';
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
function Home({tenzies,setTenzies,id}){
  console.log("homeid",id);
  const nav=useNavigate();

    return(
        <div className='root-container'>  
          {tenzies && <Confetti height={600}/>}
          <Sidebar/>
          {/* <button className="history" onClick={()=>{nav("/scores")}} >Score History</button> */}
          <section className='header'>
            <h1 className="header">Tenzies</h1>
            <p className='instruction'>Roll until all dieces are the same.Click each die to freeze it at its current value between rolls</p>
          </section>
          <section className='component'>
              <Game tenzies={tenzies} setTenzies={setTenzies} id={id}/>
          </section>
          </div>
    );
}
export default Home;