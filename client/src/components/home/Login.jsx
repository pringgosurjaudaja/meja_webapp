import 'src/styles/styles.css';

import {
    Button,
    Container,
    Form,
    Row,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { _ } from 'src/utilities/helper';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { navigate } from "@reach/router";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showNotif: false,
            validated: false,
        }
    }


    handleChange = (event) => {
        if (event.target.name === "email") {
            this.setState({ email: event.target.value });
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        this.setState({ validated: true });
        // Login with user entered details
        const loginRequest = await Requests.login(this.state.email, this.state.password);
        if (_.isNil(loginRequest)) {
            this.showNotification();
        } else {
            await Requests.makeSession(localStorage.getItem('tableId'), loginRequest.token);
            navigate('/dashboard');
        }
        
    }

    componentWillUnmount() {
        this.setState({ email: '', password: '' });
    }

    showNotification = () => {
        console.log(this.state);
        this.setState({
            showNotif: true,
            email: "",
            password: "",
          });
          setTimeout(() => {
            this.setState({
                showNotif: false,
            });
          }, 2000);
    }
    render() {
        return (
            <div className="container-home">
                <Container>
                    <Row>
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            onClick={() => navigate("/home")}
                        />
                    </Row>
                    <Row>
                        <h1 className="title">
                            Login
                        </h1>
                    </Row>
                    <Row>
                        <Form noValidate validated={this.state.validated} size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control required value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control required value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>

                            <Button style={{ backgroundColor: "black", color: "white" }} variant="primary" onClick={this.handleSubmit}>
                                SIGN IN
                            </Button>
                            
                        
                        </Form>
                    </Row>
                    <br/>
                    <Row>
                        <div style={{ width: "90%" }}className={`alert alert-warning ${this.state.showNotif ? 'alert-shown' : 'alert-hidden'}`}>
                            Invalid email or password
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}