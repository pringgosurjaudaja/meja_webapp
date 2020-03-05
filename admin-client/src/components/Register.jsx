import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'styles/styles.css';
import axios from 'utilities/helper';

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if (event.target.name == "username") {
            this.setState({ username: event.target.value});
        } else if (event.target.name == "password") {
            this.setState({ password: event.target.value});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // const instance = axios.create({
        //     baseURL: 'https://google.com',
        //     timeout: 1000,
        //     headers: { 
        //         'Access-Control-Allow-Origin': 'http://localhost:3000',
        //         'Access-Control-Allow-Methods': 'GET',
        //         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        //         'Access-Control-Allow-Credentials': 'true',
        //     },
        //   });
        axios.get('/')
            .then(function(response) {
                console.log(response);
                // DO SOEMTHING
                navigate("/dashboard");
            })
            .catch(function(error){
                console.log(error);
            });
    }
    render () {
        return (
            <div className="container-home">
                <Container>
                    <Row>
                        <h1 className="title">
                            Register    
                        </h1>
                    </Row>
                    <Row>
                        <Form className="layout--padding" onChange={this.handleChange} onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Control name="username" type="username" placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control name="password" type="password" placeholder="Password" />
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