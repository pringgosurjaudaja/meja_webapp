import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

import { Link, navigate } from "@reach/router"
  
import { Login } from 'components/Login';
import { Register } from 'components/Register';
import { Dashboard } from 'components/Dashboard';
import 'styles/styles.css';
export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid className="l-home">
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6} className="l-center">
                        <h1 className="l-home--title">Meja</h1>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                        <Button variant="primary" 
                        className="big-button big-button--text" 
                        onClick={()=>navigate("/login")}>
                            Login
                        </Button>
                        
                    </Col>
                    <Col xs={3} md={3}></Col>
                       
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                    <Button variant="primary" 
                        className="big-button big-button--text" 
                        onClick={()=>navigate("/register")}>
                            Register
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                    
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                    <Button variant="primary" 
                        className="big-button big-button--text" 
                        onClick={()=>navigate("/dashboard")}>
                            Continue as Guest
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                
            </Container>
            
        );
    }
}