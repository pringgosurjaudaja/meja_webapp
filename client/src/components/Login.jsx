import React from 'react';
import {
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'src/styles/styles.css';
import { axios } from 'src/utilities/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export class Login extends React.Component {
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
            this.setState({ email: event.target.value });
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const email = this.state.email.toString();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/auth/login',
            data: {
                email: this.state.email,
                password: this.state.password
            }
        }).then((response) => {
            console.log(response);
            sessionStorage.setItem('userId', response.data.token);
            // TODO: Insert Table ID here later from query string
            sessionStorage.setItem('tableId', '5e8347e01c9d440000231cb3');
            sessionStorage.setItem('email', email);

            navigate('/dashboard')
        }).catch(function (error) {
            console.log(error);
            alert('Invalid input');
        });

        this.setState({ email: '', password: '' });
    }

    render() {

        return (
            <div className="container-home">
                <Container>
                    <Row>
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            onClick={() => navigate("/")}
                        />
                    </Row>
                    <Row>
                        <h1 className="title">
                            Login
                        </h1>
                    </Row>
                    <Row>
                        <Form size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>

                            <Button style={{ backgroundColor: "black", color: "white" }} variant="primary" onClick={this.handleSubmit}>
                                SIGN IN
                            </Button>
                        </Form>
                    </Row>
                </Container>
            </div>
        );
    }
}