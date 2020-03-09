import React from 'react';
import { Router } from "@reach/router"
import { Login } from 'components/Login'
import { Dashboard } from 'components/Dashboard'

function App() {
  return (
    <Router>
      <Login path="/" />
      <Login path="/login" />
      <Dashboard path="/dashboard" />
    </Router>
  );
}

export default App;
