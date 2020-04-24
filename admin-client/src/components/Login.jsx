import 'src/styles/styles.css';

import {
    Button,
    Col,
    Container,
    Form,
    Row,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { _ } from "src/utilities/helper";
import logo from "src/styles/assets/logo.png";
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

    componentDidMount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', 'layout--background');
    }

    componentWillUnmount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', '');
    }

    handleChange = (event) => {
        if (event.target.name === "email") {
            this.setState({ email: event.target.value});
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value});
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        this.setState({ validated: true });

        const result = await Requests.login(this.state.email, this.state.password);

        if(_.isNil(result)) {
            this.setState({
                email: '',
                password: '',
            })
            this.showNotification();
        } else {sessionStorage.setItem("AUTH_KEY", result.token);
            navigate("/dashboard");
        } 
        
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
        const imageAlt = "Meja Logo"
        return (
            <div className="container-home">

                <Container fluid className="l-home">
                    <Row className="l-home__row">
                        <Col></Col>
                        <Col className="l-center">
                            <img className="l-home__row__title" src={logo} alt={imageAlt}></img>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row className="l-home__row">
                        <Col></Col>
                        <Col xs={3} md={3}>
                            <Form noValidate validated={this.state.validated} className="layout--padding" onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control required value={this.state.email} onChange={this.handleChange}
                                    name="email" type="text" placeholder="Enter Email" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control required value={this.state.password} onChange={this.handleChange}
                                    name="password" type="password" placeholder="Password" />
                                </Form.Group>

                                <Button className="layout--btn" variant="primary" onClick={this.handleSubmit}>
                                    Login
                                </Button>
                            </Form>

                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <div className={`login-alert alert alert-warning ${this.state.showNotif ? 'alert-shown' : 'alert-hidden'}`}>
                            Invalid email or password
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}