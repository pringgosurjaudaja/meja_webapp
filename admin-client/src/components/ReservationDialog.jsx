import React from 'react';
import { 
    Button,
    Modal,
    Form,
    Row,
    Container,
    Col
} from 'react-bootstrap';
import 'styles/styles.css';
import { _ } from 'lodash';
import axios from 'utilities/helper';


export class ReservationDialog extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render () {
        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                     Add new Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>Table Number:</Col>
                            <Col>{this.props.data.table_number}</Col>
                        </Row>
                        <Row>
                            <Col>Email:</Col>
                            <Col>{this.props.data.email}</Col>
                        </Row>
                        <Row>
                            <Col>Number:</Col>
                            <Col>{this.props.data.number_diner}</Col>
                        </Row>
                        <Row>
                            <Col>Status:</Col>
                            <Col>{this.props.data.status}</Col>
                        </Row>
                        <Row>
                            <Col>Notes:</Col>
                            <Col>{this.props.data.reservation_notes}</Col>
                        </Row>
                    </Container>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Body>
            </Modal>
            
        );
    }
}