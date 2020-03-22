
import React from 'react';
import { 
    Button,
    Form,
    Row,
    Col,
    Container,
    Alert,
} from 'react-bootstrap';
import { axios, _ } from 'utilities/helper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export class About extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            message: '',
            showNotif: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showNotification = this.showNotification.bind(this);
    }
    
    handleChange(event) {
        if(event.target.name === "phone") {
            this.setState({ phone: event.target.value });
        } else if(event.target.name === "message") {
            this.setState({ message: event.target.value });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const phone = _.get(this.state, 'phone', '');
        const message = _.get(this.state, 'message', '');
         
        axios({
            method: 'get',
            url: 'https://api.whatsapp.com/send?phone='+phone+'&text='+encodeURI(message)+'</insert>',
            timeout: 1000,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    showNotification() {
        console.log(this.state);
        this.setState({
            showNotif: true,
          });
          setTimeout(() => {
            console.log(this.state);
            this.setState({
                showNotif: false,
            });
          }, 2000);
    }

    render() {

        const phone = _.get(this.state, "phone", '0000000000');
        const message = encodeURI(_.get(this.state, "message", ''));
        const url = 'https://api.whatsapp.com/send?phone='+phone+'&text='+encodeURI(message);
        return (
            <Container className="layout--padding--menu">
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
                        <iframe width="350" height="350" frameBorder="0" style={{ "border" :0 }}
                        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJK30OsXOuEmsRUFqrA4_uz5M&key=AIzaSyAmrFFscJSU2dLMF4TJDSBya4xq2heAOQQ"
                        allowFullScreen></iframe>
                    </Col>
                    
                </Row>
                <Row>
                    <Col><h3>Share <FontAwesomeIcon className="icon-whatsapp" icon={faWhatsapp}/></h3></Col>
                    
                    
                    {/* https://api.whatsapp.com/send?phone=<insert phone>&text=<insert message></insert> */}
                </Row>
                <Row>
                    {/* <Alert variant={'success'}> Message sent!</Alert> */}
                    <div style={{ width: "100%" }}className={`alert alert-success ${this.state.showNotif ? 'alert-shown' : 'alert-hidden'}`}>
                        Message sent succesfully
                    </div>
                </Row>
                <Row>
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Send your message</Form.Label>
                                <Form.Control name="phone" type="text" placeholder="Enter Phone Number" onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control name="message" as="textarea" rows="3" placeholder="Enter Your Messaage" onChange={this.handleChange}/>
                            </Form.Group>
                            <Button 
                            href={url}
                            onClick={this.showNotification} type="submit" 
                            style={{ backgroundColor: "#25D366", borderColor: "#25D366"}} >Share</Button>
                        </Form>
                    </Col>
                </Row>
                
            </Container>
        );
    }
}