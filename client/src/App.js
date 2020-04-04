import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'src/components/home/Home';
import { Login } from 'src/components/home/Login';
import { Register } from 'src/components/home/Register';
import { Dashboard } from 'src/components/Dashboard';

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