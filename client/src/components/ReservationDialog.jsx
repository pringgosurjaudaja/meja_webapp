import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
    Modal,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'src/styles/styles.css';
import { axios, DateTime, moment } from 'src/utilities/helper';

export class ReservationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: {
                year: 0,
                month: 0,
                date: 0,
            }
        }
        this.handleChange = this.handleChange.bind(this);
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

    handleSelect(event) {
        console.log(event);
        if(event === 'logout') {
            navigate('/login');
            sessionStorage.removeItem('AUTH_KEY');
        }
    }

    render() {
        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };  
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
                        <Form size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
                            Are you sure?
                            You cannot recover your booking after a cancellation
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                        <Button type="submit" variant="danger" onClick={this.props.cancelreservation}>Confirm Cancellation</Button>
                        
                    </Modal.Footer>
                </Modal>
            </div>
            
        );
    }
}