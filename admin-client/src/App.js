import React from 'react';
import { Router, Link } from "@reach/router"
import  { Home }  from 'components/Home';
import { Login } from 'components/Login'
import { Register } from 'components/Register'
import { Dashboard } from 'components/Dashboard'

function App() {
  return (
    <Router>
      <Home path="/" />
      <Login path="/login" />
      <Register path="/register" />      
      <Dashboard path="/dashboard" />
    </Router>
  );
}

export default App;
