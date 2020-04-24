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
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { navigate } from "@reach/router";

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            email: '',
            validated: false,
        }
    }

    handleChange = (event) => {

        if (event.target.name === "name") {
            this.setState({ name: event.target.value });
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value });
        } else if (event.target.name === "email") {
            this.setState({ email: event.target.value });
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({ validated: true });

        if (await Requests.register(this.state.name, this.state.email, this.state.password)) {
            navigate('/login');
        }
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
                            Register
                        </h1>
                    </Row>
                    <Row>
                        <Form noValidate validated={this.state.validated}  className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicName">
                                <Form.Control required value={this.state.name} onChange={this.handleChange} name="name" type="name" placeholder="Fullname" />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control required value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control required value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </Row>
                </Container>
            </div>

        );
    }
}