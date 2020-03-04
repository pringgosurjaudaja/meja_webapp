import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { navigate } from "@reach/router"
import 'styles/styles.css';
import logo from "components/assets/logo.png";
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
                        <img className="l-home__row__title" src={logo}></img>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                        <Button variant="primary" 
                        className="big-button big-button--text big-button--sign-in" 
                        onClick={()=>navigate("/login")}>
                            SIGN IN
                        </Button>
                        
                    </Col>
                    <Col xs={3} md={3}></Col>
                       
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                    <Button variant="primary" 
                        className="big-button big-button--text big-button--register" 
                        onClick={()=>navigate("/register")}>
                            REGISTER
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                    
                </Row>
                
                <Row>
                    <Col xs={5} md={5}>
                        <hr className="divider"/>
                    </Col>

                    <Col style={{ textAlign: "center", fontSize: "40px", marginBottom: "25px" }} xs={2} md={2}>
                        OR
                    </Col>

                    <Col xs={5} md={5}>
                        <hr className="divider"/>
                    </Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                    <Button variant="secondary" 
                        className="big-button big-button--text big-button--continue" 
                        onClick={()=>navigate("/dashboard")}>
                            CONTINUE AS GUEST
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                
            </Container>
            
        );
    }
}