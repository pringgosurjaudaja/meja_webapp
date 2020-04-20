import React from 'react';
import {
    Row,
    Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { axios, _ } from 'src/utilities/helper';

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

    handleSubmit = (event) => {
        event.preventDefault();
        // const phone = _.get(this.state, 'phone', '');
        // const message = _.get(this.state, 'message', '');
         
        axios({
            method: 'get',
            url: 'https://api.whatsapp.com/send?text=%27Please%20use%20Meja%20cause%20its%20amazing%27',
            timeout: 1000,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
    }


    
    render () {
        const url = 'https://api.whatsapp.com/send?text=%27Check%20out%20Meja%20at%20www.Meja.com%27';
        return (
            <div>
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
                <Row>
                    <Col><h3>Share <a href={url}><FontAwesomeIcon className="icon-whatsapp" icon={faWhatsapp}/></a></h3></Col>
                </Row>
            </div>
        )
    }
}