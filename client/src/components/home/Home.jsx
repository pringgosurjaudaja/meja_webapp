import 'src/styles/styles.css';

import { Button, Col, Container, Row } from 'react-bootstrap';
import { Redirect, navigate } from "@reach/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import logo from "src/styles/assets/logo.png";

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
        await Requests.makeSession(localStorage.getItem('tableId'), '');
        navigate('/dashboard');
    }

    componentWillUnmount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', '');
    }

    render() {
        const imageAlt = "Meja Logo"

        // Validate both session and table id before rendering page
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId && Requests.getSession(sessionId)) {
            return (<Redirect to='/dashboard' noThrow />);
        }

        const urlParams = new URLSearchParams(window.location.search);
        let tableId = urlParams.get('table_id');

        if (localStorage.getItem('tableId')) {
            tableId = localStorage.getItem('tableId');
        }

        if (!(tableId && Requests.getTable(tableId))) {
            return (<Redirect to='/scan' noThrow />);
        } else {
            localStorage.setItem('tableId', tableId);
        }
        
        return (
            <Container fluid className="l-home">
                <Row>
                    <FontAwesomeIcon className="l-button-back"
                        icon={faChevronLeft}
                        onClick={() => navigate("/")}
                    />
                </Row>
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
                    <Col></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--sign-in"
                            onClick={() => navigate("/login")}>
                            SIGN IN
                        </Button>

                    </Col>
                    <Col></Col>

                </Row>
                <Row className="l-home__row">
                    <Col></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--register"
                            onClick={() => navigate("/register")}>
                            REGISTER
                        </Button>
                    </Col>
                    <Col></Col>

                </Row>

                <Row>
                    <Col  xs={3} md={3}></Col>
                    <Col>
                        <hr className="divider" />
                    </Col>

                    <Col style={{ textAlign: "center", fontSize: "14px", marginBottom: "25px" }} xs={1} md={1}>
                        OR
                    </Col>

                    <Col>
                        <hr className="divider" />
                    </Col>

                    <Col xs={3} md={3}></Col>
                </Row>
                <Row className="l-home__row">
                    <Col></Col>
                    <Col>
                        <Button variant="secondary"
                            className="big-button big-button--text big-button--continue"
                            onClick={this.handleContinueAsGuest}>
                            CONTINUE AS GUEST
                        </Button>
                    </Col>
                    <Col></Col>
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