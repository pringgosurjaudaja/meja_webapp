import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { navigate, Redirect } from "@reach/router";
import 'src/styles/styles.css';
import logo from "src/styles/assets/logo.png";
import { Requests } from 'src/utilities/Requests';

export class Landing extends React.Component {
    componentDidMount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', 'layout--background');
    }


    componentWillUnmount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', '');
    }

    render() {
        const imageAlt = "Meja Logo"

        const sessionId = localStorage.getItem('sessionId');
        if (sessionId && Requests.getSession(sessionId)) {
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
                    <Col></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--sign-in"
                            onClick={() => navigate("/scan")}>
                            DINE IN
                        </Button>

                    </Col>
                    <Col></Col>

                </Row>
                <Row className="l-home__row">
                    <Col></Col>
                    <Col>
                        <Button variant="primary"
                            className="big-button big-button--text big-button--register"
                            onClick={() => navigate("/reservation")}>
                            RESERVATION
                        </Button>
                    </Col>
                    <Col></Col>

                </Row>

                <Row className="l-home__row">
                    <Col></Col>
                    <Col>
                        <Button variant="secondary"
                            className="big-button big-button--text big-button--continue"
                            onClick={() => navigate("/about")}>
                            ABOUT
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        );
    }
}
        