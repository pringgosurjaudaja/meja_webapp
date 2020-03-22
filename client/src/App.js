import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'components/Home';
import { Login } from 'components/Login';
import { Register } from 'components/Register';
import { Dashboard } from 'components/Dashboard';
import { Reservation } from 'components/Reservation';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cart: []
    }
  }

  updateCart(newCart) {
    this.setState({
      cart: newCart
    });
  }
  
  render() {
    return (
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Register path="/register" />      
        <Dashboard path="/dashboard" 
                   cart={this.state.cart} 
                   updateCart={this.updateCart} />
        <Reservation path="/reservation" />
      </Router>
    )
  }
}

export default App;