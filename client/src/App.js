import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'src/components/Home';
import { Login } from 'src/components/Login';
import { Register } from 'src/components/Register';
import { Dashboard } from 'src/components/Dashboard';
import { Reservation } from 'src/components/Reservation';

class App extends React.Component {  
  render() {
    return (
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Register path="/register" />      
        <Dashboard path="/dashboard" />
      </Router>
    )
  }
}

export default App;