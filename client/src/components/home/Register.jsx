import React from 'react';
import {
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'src/styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Requests } from 'src/utilities/Requests';

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            email: '',
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
                        <Form className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicName">
                                <Form.Control value={this.state.name} onChange={this.handleChange} name="name" type="name" placeholder="Fullname" />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
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