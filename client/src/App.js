import React from 'react';
import { Router } from "@reach/router";
import { Home }  from 'src/components/home/Home';
import { Login } from 'src/components/home/Login';
import { Register } from 'src/components/home/Register';
import { Dashboard } from 'src/components/Dashboard';

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
			<Dashboard path="/dashboard" sessionId={this.state.sessionId} setSessionId={this.setSessionId}  />
		</Router>
		)
	}
}

export default App;