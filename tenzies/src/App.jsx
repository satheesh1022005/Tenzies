import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Game from './components/Game';
import Confetti from 'react-confetti'
import Scores from './components/scores';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  const [tenzies,setTenzies]=React.useState(false);
  return(
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/signup" element={<Register/>}/>
        <Route path='/home' element={
          <div className='root-container'>  
          {tenzies && <Confetti height={600}/>}
          <section className='header'>
            <h1>Tenzies</h1>
            <p className='instruction'>Roll until all dieces are the same.Click each die to freeze it at its current value between rolls</p>
          </section>
          <section className='component'>
              <Game tenzies={tenzies} setTenzies={setTenzies}/>
          </section>
          </div>
        }/>
        <Route path="/scores" element={<Scores/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
