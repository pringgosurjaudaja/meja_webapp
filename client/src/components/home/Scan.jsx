import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { navigate, Redirect } from "@reach/router";
import 'src/styles/styles.css';
import logo from "src/styles/assets/logo.png";
import { Requests } from 'src/utilities/Requests';

export class Scan extends React.Component {


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
            <Container fluid className="l-landing">
                <Row className="l-home__row">

                    <Col>
                        Please open your device camera and scan the QR code provided on the table or by the staffs.<br/>
                        The link will take you to the login page
                    </Col>
                </Row>
            </Container>

        );
    }
}
        