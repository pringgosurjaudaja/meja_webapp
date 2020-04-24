import 'src/styles/styles.css';

import {
    Button,
    Form,
    Modal,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { _ } from 'src/utilities/helper';
import { navigate } from "@reach/router";
export class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    handleChange(event) {
        if (event.target.name === "email") {
            this.setState({ email: event.target.value});
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value});
        }
    }

    handleSubmit = async (event) => {
        try {
            const loginRequest = await Requests.login(this.state.email, this.state.password);
            
            if (_.isNil(loginRequest)) {
                navigate('/home');
            } else {
                await Requests.makeSession('5e8347e01c9d440000231cb3', loginRequest.token);
                window.location.reload();
            }

            this.setState({ email: '', password: ''});
        } catch (err) {
            console.error(err);
        }
            
            
        
    }

    render() {
        return (  
            <Modal
                {...this.props}
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Form size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                        </Form.Group>

                        <Button  style={{ backgroundColor: "black", color: "white"}} variant="primary" onClick={this.handleSubmit}>
                            SIGN IN
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}