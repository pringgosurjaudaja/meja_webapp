import 'src/styles/styles.css';

import {
    Container,
    Row,
} from 'react-bootstrap';

import { About } from 'src/components/about/About';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '@reach/router';

export class LandingAbout extends React.Component {


    render() {
        return (
            <Container className="l-reserve">
                <Row>
                    <FontAwesomeIcon className="l-button-back"
                        icon={faChevronLeft}
                        onClick={() => navigate("/")}
                    />
                </Row>
                <br/>
                <About/>
            </Container>
        );
    }
}
