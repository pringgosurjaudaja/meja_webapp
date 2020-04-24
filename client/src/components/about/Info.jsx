import {
    Button,
    Col,
    Row,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            message: '',
            showNotif: false,
        }
    }
        
    handleChange = (event) => {
        if(event.target.name === "phone") {
            this.setState({ phone: event.target.value });
        } else if(event.target.name === "message") {
            this.setState({ message: event.target.value });
        }
    }



    
    render () {
        const url = 'https://api.whatsapp.com/send?text=%27Check%20out%20Meja%20at%20www.Meja.com%27';
        return (
            <div className="bottom-up">
                <Row>
                    <Col>
                        <h2>About</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Meja is an authentic Vietnamese Cantonese Russian Fusion fine dining
                            <br/>Serving the best out of each culture.
                            <br/>Meja promises the best service and dining above everything else</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Find us at</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <iframe title={"map"} width="350" height="350" frameBorder="0" style={{ "border" :0 }}
                            src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJK30OsXOuEmsRUFqrA4_uz5M&key=AIzaSyAmrFFscJSU2dLMF4TJDSBya4xq2heAOQQ"
                            allowFullScreen></iframe>
                    </Col>
                    
                </Row>
                <Row className="bottom-up">
                    <Col>
                        <Button href={url}>
                            Share<FontAwesomeIcon className="icon-whatsapp" icon={faWhatsapp}/>
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}