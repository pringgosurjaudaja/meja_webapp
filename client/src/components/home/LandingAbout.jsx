import React from 'react';
import { 
    Container,
    Row,
} from 'react-bootstrap';
import 'src/styles/styles.css';
import { navigate } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { About } from 'src/components/about/About';

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
