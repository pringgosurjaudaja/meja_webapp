import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';

import 'styles/styles.css';

export class Register extends React.Component {
    render () {
        return (
            <div className="container-login">
                <Container>
                    <Row>
                        <h3 className="title">
                            Register    
                        </h3>
                    </Row>
                    <Row>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
    
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="Username" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" />
                            </Form.Group>
                            
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Row>
                </Container>    
            </div>
            
        );
    }
}