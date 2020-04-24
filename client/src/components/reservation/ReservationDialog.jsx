import 'src/styles/styles.css';

import {
    Button,
    Form,
    Modal,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import React from 'react';

export class ReservationDialog extends React.Component {

    render() {
        return (
            <div>
                <Modal
                {...this.props}
                centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Cancel Booking</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Form size="lg" className="layout--padding">
                            Are you sure?
                            You cannot recover your booking after a cancellation
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                        <Button type="submit" variant="danger" onClick={()=>{this.props.cancelReservation()}}>Confirm Cancellation</Button>
                        
                    </Modal.Footer>
                </Modal>
            </div>
            
        );
    }
}

ReservationDialog.propTypes = {
    cancelreservation: PropTypes.func
};