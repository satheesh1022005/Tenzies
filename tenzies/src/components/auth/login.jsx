import React,{useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Login(){
    const [data,setData]=useState({
        username:"",
        password:""
    });
    const [Message, setMessage] = useState("");
    function handleSubmit() {
        console.log(data);
        axios.post("http://localhost:8800/login", data)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data.message); // Successful login message
                    setMessage(res.data.message);
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    //console.("Unauthorized: Username/password incorrect");
                    setMessage("Username/password incorrect");
                }
                if(err.response.status === 400){
                    setMessage("User does not exist. Sign up to create an account.");
                }
                else {
                    //console.(":", err); // Other s
                    setMessage("An error occurred. Please try again later.");
                }
            });
            setData({
                username:"",
                password:""
            });
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
        <div className="auth-container">
            <h1>Login</h1>  
            <label htmlFor="usename">User name</label>        
            <input type="username" id="username" name="username" placeholder="user name" value={data.username} onChange={handleChange}/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" value={data.password} onChange={handleChange}/>
            <button type="submit" onClick={handleSubmit}>Login</button>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            <p><a href="/forgot-password">Forgot Password?</a></p>
            <p><a href="/reset-password">Reset Password</a></p>
            <p><a href="/">Back to Home</a></p>
             {errorMessage &&<p>{errorMessage}</p>}
        </div>
    );
}
export default Login;