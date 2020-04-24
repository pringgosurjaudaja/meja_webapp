import 'src/styles/styles.css';

import { Col, Container, Row } from 'react-bootstrap';
import { Redirect, navigate } from "@reach/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import qrSample from './qrsample.png';

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

        const sessionId = localStorage.getItem('sessionId');
        if (sessionId && Requests.getSession(sessionId)) {
            return (<Redirect to='/dashboard' noThrow />)
        }

        return (
            <Container fluid className="l-landing">
                <Row>
                    <FontAwesomeIcon className="l-button-back"
                        icon={faChevronLeft}
                        onClick={() => navigate("/")}
                    />
                </Row>
                <Row className="l-home__row">

                    <Col>
                        <h4>
                            Scan the QR code on the table to begin your order. 
                        </h4>
                        <img style={{height: '100px', marginTop: '50px'}} src={qrSample} alt='QR Sample' />
                    </Col>
                </Row>
            </Container>

        );
    }
}
        