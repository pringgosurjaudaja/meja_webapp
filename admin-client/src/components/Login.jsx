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
import { Requests } from 'src/utilities/Requests';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
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
        const result = await Requests.login(this.state.email, this.state.password);
        sessionStorage.setItem("AUTH_KEY", result.token);
        navigate("/dashboard");
    }

    render() {
        return (
            <div className="container-home">
                <Container>
                    <Row>
                        <h1 className="title">
                            Login    
                        </h1>
                    </Row>
                    <Row>
                        <Form className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.handleChange}
                                name="email" type="text" placeholder="Enter Email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.handleChange}
                                name="password" type="password" placeholder="Password" />
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