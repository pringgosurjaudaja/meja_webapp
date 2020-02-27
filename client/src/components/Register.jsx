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
            <div className="container-home">
                <Container>
                    <Row>
                        <h1 className="title">
                            Register    
                        </h1>
                    </Row>
                    <Row>
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
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