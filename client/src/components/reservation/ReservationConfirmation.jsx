import 'src/styles/styles.css';

import {
    Button,
    Col,
    Container,
    Row,
} from 'react-bootstrap';

import React from 'react';
import { ReservationDialog } from 'src/components/reservation/ReservationDialog';

export class ReservationConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
        }
    }

    render() {

        return (
            <Container fluid className="l-reserve">
                <Row className="l-reserve__row l-reserve-details__row l-reserve-title">
                    <h1>Your Reservation</h1>
                </Row>
                <hr/>
                <Row className="l-reserve__row--small l-reserve-details__row">
                    <Col>Booked for <strong>{this.props.numPeople} people</strong></Col>
                </Row>
                <Row className="l-reserve__row--small l-reserve-details__row">
                    <Col>On the <strong>{this.props.date}</strong> </Col>
                </Row>
                <Row className="l-reserve__row--small l-reserve-details__row">
                    <Col>at <strong>{this.props.time}</strong> </Col>
                </Row>
                <Row className="l-reserve__row--small l-reserve-details__row">
                    <Col>You will be asked for the reservation email ( <strong>{ this.props.email }</strong> ) on your arrival  </Col>
                </Row>
                <Row className='small-button-row'>
                    <Col>
                        <Button className="small-button" variant="secondary"
                        onClick={()=> this.setState({ showDialog: true })}
                        >Cancel Booking</Button>
                    </Col>
                </Row>
                <ReservationDialog show={this.state.showDialog}
                onHide={()=>this.setState({ showDialog:false })}
                {...this.props.dialogProps}/>
            </Container>
            
        );
    }
}