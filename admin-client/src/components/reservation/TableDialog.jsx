import 'src/styles/styles.css';

import {
    Modal,
    Form,
    Button
} from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import React from 'react';
import { Requests } from 'src/utilities/Requests';

export class TableDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: 1,
            tableName: '',  // New table Name
            tableId: '',    // Table Id
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

    handleChange = (event) => {
        if (event.target.name === "add") {
            this.setState({ tableName: event.target.value });
        } else {
            this.setState({ tableId: event.target.value });
            console.log(event.target.value);
        }
    }

    handleAddTable = async (e) => {
        let result = await Requests.addTable(this.state.tableName, this.state.seats);
        console.log(result);
    }

    handleDeleteTable = async (e) => {
        await Requests.deleteTable(this.state.tableId);
    }

    getForm = () => {
        if (this.props.addTable === true) {
            return (
                <div>
                    <h4>Number of Seats</h4>
                    <Form onSubmit={this.handleAddTable}>
                        <Form.Group>
                            <Form.Control value={this.state.tableName} onChange={this.handleChange}
                            name="add" type="text" placeholder="Enter Table Name" />
                        </Form.Group>
                        <InputNumber 
                                onChange={this.handleQuantityChange} 
                                focusOplaceholder="Quantity" 
                                min={1} 
                                defaultValue={1} 
                        />
                        <br/>
                        <br/>
                        <Button type="submit">Submit</Button>
                    </Form>
                    
                </div>
            );
        } else {
            let options = [];
            this.props.tables.forEach((table)=>{
                let option = (<option value={table._id}>{table.name}</option>);
                options.push(option);
            })
            return (
                <div>
                    <h4>Number of Seats</h4>
                    <Form onSubmit={this.handleDeleteTable}>
                    <Form.Group>
                            <Form.Control as="select" onChange={this.handleChange}
                            name="delete" type="text">
                                {options}
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                    
                </div>
            );
        }
    }
    render () {
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