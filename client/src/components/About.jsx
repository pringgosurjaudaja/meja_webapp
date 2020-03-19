
import React from 'react';
import { 
    Button,
    Modal,
    Row,
    Col,
    Container,
} from 'react-bootstrap';
import axios from 'utilities/helper';

export class About extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <h2>Find us at</h2>
                    <iframe width="600" height="450" frameBorder="0" style={{ "border" :0 }}
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJK30OsXOuEmsRUFqrA4_uz5M&key=AIzaSyAmrFFscJSU2dLMF4TJDSBya4xq2heAOQQ"
                    allowFullScreen></iframe>
                </Row>
            </Container>
        );
    }
}