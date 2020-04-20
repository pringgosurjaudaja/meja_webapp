import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'src/components/home/Home';
import { Login } from 'src/components/home/Login';
import { Register } from 'src/components/home/Register';
import { Dashboard } from 'src/components/Dashboard';
import { LandingReservation } from 'src/components/home/LandingReservation';
import { LandingAbout } from 'src/components/home/LandingAbout';
import { Landing } from 'src/components/home/Landing';
import { Scan } from 'src/components/home/Scan';

class App extends React.Component {  
	render() {
		return (
		<Router>
			<Landing path="/" />
			<Home path="/home" />
			<Login path="/login" />
			<Register path="/register" />      
			<Dashboard path="/dashboard" />
			<LandingReservation path="/reservation" />
			<LandingAbout path="/about" />
			<Scan path="/scan" />
		</Router>
		)
	}
}

export default App;