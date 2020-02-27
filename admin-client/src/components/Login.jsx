import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'styles/styles.css';
  
import { Home } from './Home';
import { Dashboard } from './Dashboard';

export class Login extends React.Component {
    constructor(props) {
        super(props);
    
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
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Control type="username" placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" onClick={()=>navigate("/dashboard")}>
                                Submit
                            </Button>
                        </Form>
                    </Row>
                </Container>
            </div>
        );
    }
}