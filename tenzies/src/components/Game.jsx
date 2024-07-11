import React from "react";
import './Game.css';
import { nanoid } from "nanoid";
import axios from "axios";

function Game({ tenzies, setTenzies, id }) {
    const [values, setValues] = React.useState([]);
    const [cnt, Setcnt] = React.useState(0);
    const [time, setTime] = React.useState({ minutes: 0, seconds: 0, milliSeconds: 0 });
    const [gameOver, setGameOver] = React.useState(false);
    const [timerInterval, setTimerInterval] = React.useState(null);

    const boxes = values.map((obj, index) => {
        return (
            <div key={index} onClick={() => freeze(obj.id)} className={obj.freeze ? "btn-design selected" : "btn-design"}>
                {Array.from({ length: obj.value }, (_, i) => (
                    <div key={i} className="dot"></div>
                ))}
            </div>
        );
    });

    function timer() {
        setTime(prev => {
            let { milliSeconds, seconds, minutes } = prev;
            milliSeconds += 10;
            if (milliSeconds >= 1000) {
                milliSeconds = 0;
                seconds += 1;
            }
            if (seconds >= 60) {
                seconds = 0;
                minutes += 1;
            }
            return { minutes, seconds, milliSeconds };
        });
    }

    function freeze(id) {
        setValues(prev => prev.map(die => {
            return die.id === id ? { ...die, freeze: !die.freeze } : die;
        }));
    }

    function change() {
        const newArray = [];
        for (let i = 0; i < 10; i++) {
            const newValue = Math.floor(Math.random() * 6) + 1;
            if (!values[i]?.freeze) {
                newArray[i] = {
                    value: newValue,
                    freeze: false,
                    id: nanoid(),
                };
            } else {
                newArray[i] = {
                    value: values[i].value,
                    freeze: true,
                    id: values[i].id,
                };
            }
        }
        Setcnt(cnt => cnt + 1);
        setValues(newArray);
    }
    function calculateScore(time, rolls) {
        //console.log(time,rolls);
        //console.log(typeof time.minutes);
        const totalSeconds=time.minutes * 60 + time.seconds + time.milliSeconds / 1000;
        //console.log("tot",totalSeconds);
        const T_w = 1; 
        const R_w = 2; 
        const C = 1000; 
        const score = C / ((totalSeconds * T_w) + (rolls * R_w));
        //console.log(score);
        return score;
    }
    function clearData() {
        setTenzies(false);
        setValues([]);
        Setcnt(0);
        setTime(prev => ({
            ...prev,
            minutes: 0,
            seconds: 0,
            milliSeconds: 0
        }));
        setGameOver(false);
        clearInterval(timerInterval);
        setTimerInterval(null);
    }

    React.useEffect(() => {
        if (gameOver) {
            clearInterval(timerInterval);
            //console.log(time);
        }
    }, [gameOver, timerInterval, time]);

    React.useEffect(() => {
        if (values.length > 0 && !timerInterval) {
            const interval = setInterval(timer, 10);
            setTimerInterval(interval);
        }
    }, [values, timerInterval]);

    React.useEffect(() => {
        if (values.length > 0) {
            const held = values.every(val => val.freeze);
            const iniValue = values[0]?.value;
            const allSameValue = values.every(val => val.value === iniValue);
            const score=calculateScore(time,cnt);
            if (held && allSameValue) {
                //console.log(score);
                axios.post("http://localhost:8800/addscore", { userid: id, score: score })
                    .then(res => console.log(res.data))
                    .catch(err => console.log(err));
                setTenzies(true);
                setGameOver(true);
                console.log("You win");
            }
        }
    }, [values, cnt, id, setTenzies]);

    return (
        <div className="game-container">
            <div className="value-container">
                {boxes}
            </div>
            {values.length === 0 ? 
                <button className="roll" onClick={change}> Let's Start</button> :
                tenzies ? 
                    <button onClick={clearData} className="roll die-roll">New game</button> :
                    <div className="roll-container"> 
                        <button onClick={change} className="roll die-roll">Roll</button>
                        <a onClick={clearData} className="clear">Clear</a>
                    </div>}
            {values.length > 0 && <div className="features"></div>}
            <p className="text">Dice roll count: {cnt}</p>
            <p className="text">Time: {time.minutes}:{time.seconds}:{time.milliSeconds}</p>
        </div>
    );
}

export default Game;
