import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'src/components/Home';
import { Login } from 'src/components/Login';
import { Register } from 'src/components/Register';
import { Dashboard } from 'src/components/Dashboard';
import { Reservation } from 'src/components/Reservation';

class App extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {
			sessionId: ''
		}
	}

	setSessionId = (sessionId) => {
		this.setState({
			sessionId: sessionId
		})
	}
	
	render() {
		return (
		<Router>
			<Home path="/" setSessionId={this.setSessionId} />
			<Login path="/login" setSessionId={this.setSessionId} />
			<Register path="/register" />      
			<Dashboard path="/dashboard" sessionId={this.state.sessionId} />
		</Router>
		)
	}
}

export default App;