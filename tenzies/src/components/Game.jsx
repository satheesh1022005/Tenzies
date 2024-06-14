import React from "react";
import './Game.css';
import {nanoid} from "nanoid"
import axios from "axios";
function Game({tenzies,setTenzies,id}){
    console.log("id",id);
    const[values,setValues]=React.useState([]);
    const[cnt,Setcnt]=React.useState(0);
    const[time,setTime]=React.useState({minutes:0,seconds:0,milliSeconds:0})
    const[gameOver,setGameOver]=React.useState(false);
    const [timerInterval, setTimerInterval] = React.useState(null);
    const boxes=values.map((obj,index)=>{
        return(
            <div key={index} onClick={()=>freeze(obj.id)} className={obj.freeze ?"btn-design selected":"btn-design "}>
                {Array.from({ length: obj.value }, (_, i) => (
                    <div key={i} className="dot"></div>
                    ))}
            </div>
        );
    })
    function timer(){
        setTime(prev=>{
            prev.milliSeconds+=1;
            if(prev.milliSeconds===1000){
                prev.milliSeconds=0;
                prev.seconds+=1;
                if(prev.seconds===60){
                    prev.seconds=0;
                    prev.minutes+=1;
                }
            }
            //console.log(timerInterval);
            return{
                minutes:prev.minutes,
                seconds:prev.seconds,
                milliSeconds:prev.milliSeconds,
            }
        })
    }
    // function start() {
    //     const interval = setInterval(timer, 1);
    //     setTimerInterval(interval);
    // }
    function freeze(id){
        setValues(prev=> prev.map(die=>{
            return die.id===id ? {...die,freeze:!die.freeze} : die;
        }))
    }
    function change(){
        const newArray=[];
        for(let i=0;i<10;i++){
            const newValue=Math.floor(Math.random()*6)+1;
            if(!values[i]?.freeze){
                newArray[i]={
                    value:newValue,
                    freeze:false,
                    id:nanoid(),
                }
            }else{
                newArray[i]={
                    value:values[i].value,
                    freeze:true,
                    id:values[i].id,
                }
            }
        }
        Setcnt(cnt=> cnt+1);
        setValues(newArray);
    }
    function clearData(){
        setTenzies(false);
        setValues([]);
        Setcnt(0); 
        setGameOver(false);
        clearInterval(timerInterval);
        setTimerInterval(null);
    }
    React.useEffect(() => {
        if (gameOver) {
            clearInterval(timerInterval);
            //console.log(time);
        }
    }, [gameOver]);
    React.useEffect(()=>{
        if(values.length>0){
        const held=values.every(val=> val.freeze);
        const iniValue=values[0]?.value;
        const allSameValue = values.every(val => val.value === iniValue);;
        if(held&&allSameValue){
            axios.post("http://localhost:8800/addscore",{userid:id,score:cnt})
            .then(res=>console.log(res.data))
            .catch(err=>console.log(err));
            setTenzies(true);
            setGameOver(true);
            console.log("You win");
            
        }        
    }
    },[values])
    return(
        <div className="game-container">
            <div className="value-container">
                    {boxes}
            </div>
            {values.length==0 ?<button className="roll" onClick={()=>{
                change();
            }}> Let's Start</button> :
            tenzies ? <button onClick={clearData}  className="roll die-roll">New game</button> : <button onClick={change}  className="roll die-roll">Roll</button>}
            {values.length>0 &&<div className="features">
                
            </div>}
            <p className="text">Dice roll count: {cnt}</p>

        </div>
    );
}
export default Game;