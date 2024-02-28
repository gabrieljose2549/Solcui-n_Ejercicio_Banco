import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import RegisterForm from './Components/RegisterForm'
import Dashboard from './Components/Dashboard';
import { useState } from 'react';

function App() {
  const [token, setToken]= useState("");
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element = {<RegisterForm setToken={setToken}/>}/>
            <Route exact path='/api/accounts/user/:userId' element={<Dashboard token={token} />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
