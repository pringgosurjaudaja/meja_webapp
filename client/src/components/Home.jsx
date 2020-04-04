import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { navigate, Redirect } from "@reach/router";
import 'src/styles/styles.css';
import logo from "src/components/assets/logo.png";
import { Requests } from '../utilities/Requests';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginDialog: false,
        }
    }

    componentDidMount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', 'layout--background');
    }

    handleContinueAsGuest = async () => {
        this.props.setSessionId(await Requests.makeSession('5e8347e01c9d440000231cb3', ''));
        navigate('/dashboard');
    }

    componentWillUnmount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', '');
    }

    render() {
        const imageAlt = "Meja Logo"

        const sessionId = localStorage.getItem('sessionId');
        if (sessionId && Requests.getSession(sessionId)) {
            this.props.setSessionId(sessionId);
            return (<Redirect to='/dashboard' noThrow />)
        }

        return (
            <Container fluid className="l-home">
                <Row className="l-home__row">
                    <Col></Col>
                    <Col className="l-center">
                        <img className="l-home__row__title" src={logo} alt={imageAlt}></img>
                    </Col>
                    <Col></Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}></Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--sign-in"
                            onClick={() => navigate("/login")}>
                            SIGN IN
                        </Button>

                    </Col>
                    <Col xs={3} md={3}></Col>

                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--register"
                            onClick={() => navigate("/register")}>
                            REGISTER
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>

                </Row>

                <Row>
                    <Col>
                        <hr className="divider" />
                    </Col>

                    <Col style={{ textAlign: "center", fontSize: "14px", marginBottom: "25px" }} xs={1} md={1}>
                        OR
                    </Col>

                    <Col>
                        <hr className="divider" />
                    </Col>
                </Row>
                <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col>
                        <Button variant="secondary"
                            className="big-button big-button--text big-button--continue"
                            onClick={this.handleContinueAsGuest}>
                            CONTINUE AS GUEST
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>

                {/* <Row className="l-home__row">
                    <Col xs={3} md={3}></Col>
                    <Col xs={6} md={6}>
                    <Button variant="secondary" 
                        className="big-button big-button--text big-button--continue" 
                        onClick={()=> this.setState({ showLoginDialog: true })}>
                            RESERVATION
                        </Button>
                    </Col>
                    <Col xs={3} md={3}></Col>
                </Row>
                <LoginDialog show={this.state.showLoginDialog} onHide={()=>this.setState({ showLoginDialog:false })}/> */}
            </Container>

        );
    }
}