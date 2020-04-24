import { Dashboard } from 'src/components/Dashboard'
import { Login } from 'src/components/Login'
import React from 'react';
import { Router } from "@reach/router"

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
