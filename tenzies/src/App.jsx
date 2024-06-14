import React, { useEffect,useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Game from './components/Game';
import Confetti from 'react-confetti'
import Scores from './components/scores';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './components/Home';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
function App() {
  const [userName,setUserName]=useState("");
  const[id,setId]=useState("");
  const [tenzies,setTenzies]=useState(false);
  const isAuthenticated = userName!="";
  console.log(id);
  return(
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login userName={userName} setUserName={setUserName} id={id} setId={setId}/>}/>
      <Route path="/signup" element={ <Register/>}/>
      <Route path='/home' element={isAuthenticated ? <Home tenzies={tenzies} setTenzies={setTenzies} id={id}/> : <Navigate to="/"/>}/>
      <Route path="/scores" element={isAuthenticated ?<Scores id={id}/> : <Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
