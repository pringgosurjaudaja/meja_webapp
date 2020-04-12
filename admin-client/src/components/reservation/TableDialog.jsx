import 'src/styles/styles.css';

import {
    Modal,
    Form,
    Button
} from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import React from 'react';

export class TableDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: 1,
        }
    }


    getModalTitle = () => {
        if (this.props.addTable === true) {
            return "Add Table"
        } else {
            return "Delete Table"
        }
    }

    changeSeat = (event) => {
        this.setState({ seats: event.target.value });
    }

    handleQuantityChange = (event) => {
        console.log(event);
        this.setState({ seats: event })
    }

    getForm = () => {
        if (this.props.addTable === true) {
            return (
                <div>
                    <h2>Number of Seats</h2>

                    <InputNumber 
                            onChange={this.handleQuantityChange} 
                            focusOplaceholder="Quantity" 
                            min={1} 
                            defaultValue={1} 
                    />
                    <br/>
                    <br/>
                    <Button>Submit</Button>
                </div>
            );
        } else {

        }
    }
    render () {
       console.log(this.props);

        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.getModalTitle()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.getForm()}
                </Modal.Body>
            </Modal>
            
        );
    }
}