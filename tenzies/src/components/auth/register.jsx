import axios from "axios";
import React, { useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import './auth.css';
function Register(){
    const[message,setMessage]=useState("");
    const[data,setData]=useState({
        username:"",
        email:"",
        password:""
    })
    const navigate=useNavigate();
    function handleSubmit(){
        console.log("Register",data);
        axios.post("https://tenzies-nv63.onrender.com/register",data)
            .then((res)=>{
                if(res.status==200){
                    setMessage(res.data.message);
                    navigate("/");
                }
            })
            .catch(err=>{
                if(err.response.status==400){
                    setMessage("User name already exists");
                }
                else{
                    setMessage("Internal Server error");
                }
            })
    }
    function handleChange(e){
        const { name, value } = e.target;
        setData(prevState => {
            const newState = {
                ...prevState,
                [name]: value
            };
            //console.log(newState);
            return newState;
        })
        //console.log(data);
    }
    return(
        <div className="signup-container">
            <h1>Signup</h1>
            <label htmlFor="userName">User name</label>
            <input id="username" name="username" placeholder="user name" onChange={handleChange}></input>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" placeholder="email" type="email" onChange={handleChange}></input>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" placeholder="password" type="password" onChange={handleChange}></input>
            <button onClick={handleSubmit}>Register</button>
            <p>Already have an account? <Link to="/">Login</Link></p>
            {message && <p className="err">{message}</p>}
        </div>
    );
}
export default Register;