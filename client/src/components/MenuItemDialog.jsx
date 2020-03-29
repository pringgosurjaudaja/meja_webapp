import React from 'react';
import { Modal, Button, Card, Alert, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import example from './assets/test.jpg';
import { cartOps } from 'src/components/Dashboard';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addedToCart: false,
            quantity: 1,
            notes: ''
        }
    }

    handleQuantityChange = (val) => {
        this.setState({ quantity: val });
    }

    handleNotesChange = (e) => {
        this.setState({ notes: e.target.value.toString() });
    }

    handleAddToCart = () => {
        const orderItem = {
            menuItem: this.props.item,
            quantity: this.state.quantity,
            notes: this.state.notes
        }
        this.props.updateCart(orderItem, cartOps.ADD)
        this.setState({ addedToCart: true });
    }

    render() {
        const { item, show, onHide } = this.props;

        return (
            <div>
                <Modal 
                    dialogClassName='menu-item-dialog' 
                    show={show} 
                    onHide={onHide}
                >
                    <Modal.Header closeButton />

                    <Modal.Body>
                        <Card.Img variant="top" src={example} />

                        {/* Title & Description */}
                        <Modal.Title>{item.name}</Modal.Title>
                        <p>{item.description}</p>
                        
                        {/* Notes for Menu Item */}
                        <FormLabel>Add notes</FormLabel>
                        <InputGroup>
                            <FormControl 
                                onChange={this.handleNotesChange} 
                                as="textarea" 
                                aria-label="With textarea" 
                            />
                        </InputGroup>

                        {/* Quantity of Menu Item */}
                        <InputNumber 
                            onChange={this.handleQuantityChange} 
                            focusOplaceholder="Quantity" 
                            min={1} 
                            defaultValue={1} 
                        />

                        <Button 
                            onClick={this.handleAddToCart} 
                            disabled={this.state.addedToCart} 
                            data-dismiss="modal" 
                            variant="primary"
                        >
                            Add to cart
                        </Button>

                        {/* Successfully Added Alert */}
                        {this.state.addedToCart &&
                            <Alert variant="success">
                                Added to cart.
                            </Alert>}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.onHide} variant="secondary">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}