import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'components/Home';
import { Login } from 'components/Login';
import { Register } from 'components/Register';
import { Dashboard } from 'components/Dashboard';
import { Reservation } from 'components/Reservation';

function App() {
  return (
    <Router>
      <Home path="/" />
      <Login path="/login" />
      <Register path="/register" />      
      <Dashboard path="/dashboard" />
      <Reservation path="/reservation" />
    </Router>
  );
}

export default App;