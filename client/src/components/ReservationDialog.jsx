import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
    Modal,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'styles/styles.css';
import { axios } from 'utilities/helper';
import { DateTime, moment } from 'utilities/helper';

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
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        if(this.props.edit) {
            axios({
                method: 'post',
                url: '',
                data: {
                }
                }).then(function(response) {
                    console.log(response);
                }).catch(function(error) {
                    console.log(error);
                });
            
        } else {

        }
        
    }

    render() {
        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };  
        return (
            <div>
                {this.props.edit === 'true' ?
                <Modal
                {...this.props}
                centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Reservation</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Form size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>:''}
                {this.props.edit !== 'true' ?
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
                            <Button>Confirm cancellation</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>:''}
            </div>
            
        );
    }
}