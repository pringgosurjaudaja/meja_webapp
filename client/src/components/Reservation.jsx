import React from 'react';
import { navigate } from "@reach/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { 
    Container,
    Row,
    Nav,
    Button,
    Form,
    Col,
} from 'react-bootstrap';

import { DateTime, moment } from 'utilities/helper';

import 'styles/react-datetime.css';
import { ReservationDialog } from 'components/ReservationDialog';

export class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date().toISOString(),
            date: {
                year: 0,
                month: 0,
                date: 0,
            },
            reserved: true,
            edit: false,
            showDialog: false,
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSelect(event) {
        console.log(event);
        if(event === 'logout') {
            navigate('/login');
            sessionStorage.removeItem('AUTH_KEY');
        }
    }

    handleChange(event) {
        const year = event.year();
        const month = event.month();
        const date = event.date();
        this.setState({
            date: {
                year: year,
                month: month,
                date: date,
            }
        })
    }

    render () {

        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };

        const numPeople = 2;
        const date = "31/03/2020";
        const time = "7:30 pm"

        let dialogProps = {
            edit: this.state.edit.toString(),
        }

        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon icon={faSignOutAlt} transform="grow-10" color="black"/>
                        </Nav.Link>
                    </Nav.Item>
                    
                </Nav>
                { !this.state.reserved ?
                <Container className="l-reserve">
                    <Row className="l-reserve__row">
                        <h1>Make Reservation</h1>
                    </Row>
                    <hr/>
                    <Row className="l-reserve__row">
                        <Form>
                            <Form.Group>
                                <Form.Label>Pick Date</Form.Label>
                                <DateTime timeFormat={false}
                                isValidDate={valid}
                                onChange={this.handleChange}
                                />
                            </Form.Group>


                            <Form.Group>
                                <Form.Label>Pick Time</Form.Label>
                                <Form.Control as="select">
                                    <option>select time</option>
                                    <option>6.15 pm</option>
                                    <option>7.15 pm</option>
                                    <option>9.30 pm</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Number of Diners</Form.Label>
                                <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                    <option>11</option>
                                    <option>12</option>
                                    
                                </Form.Control>
                            </Form.Group>
                            <Button>Confirm Reservation</Button>
                        </Form>
                    </Row>
                </Container>: ''}
                
                { this.state.reserved ?
                <Container fluid className="l-reserve">
                    <Row className="l-reserve__row l-reserve-details__row">
                        <h1>Your Reservation</h1>
                    </Row>
                    <hr/>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>Booked for <strong>{numPeople} people</strong></Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>On the <strong>{date}</strong> </Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>at <strong>{time}</strong> </Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>An email confirmation will be sent to you shortly  </Col>
                    </Row>
                    <Row className='small-button-row'>
                        <Col>
                            <Button className="small-button" variant="primary"
                            onClick={()=> this.setState({ edit: true, showDialog: true })}
                            >Edit Booking</Button>
                        </Col>
                        <Col>
                            <Button className="small-button" variant="secondary"
                            onClick={()=> this.setState({ edit: false, showDialog: true })}
                            >Cancel Booking</Button>
                        </Col>
                    </Row>
                    <ReservationDialog show={this.state.showDialog}
                    onHide={()=>this.setState({ showDialog:false })}
                    {...dialogProps}/>
                </Container> : ''
                }
                
            </div>
        );
    }
}