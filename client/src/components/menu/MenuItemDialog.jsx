import React from 'react';
import { Modal, Button, Card, Alert, InputGroup, FormControl, FormLabel, Tab, Tabs } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import example from 'src/styles/assets/test.jpg';
import { cartOps } from 'src/components/Dashboard';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
            menu_item: this.props.item,
            quantity: this.state.quantity,
            notes: this.state.notes
        };
        this.props.updateCart(orderItem, cartOps.ADD);
        this.props.handleClose();
    }

    render() {
        const { item, show, onHide, itemInCart } = this.props;
        console.log(this.props);
        return (
            <div>
                {item && <Modal 
                    dialogClassName='menu-item-dialog' 
                    show={show} 
                    onHide={onHide}
                >
                    <Modal.Header closeButton />

                    <Modal.Body>
                        <Tabs>
                            <Tab eventKey="info" title="Info">
                                <Card.Img variant="top" src={example} />
                            
                                {/* Title & Description */}
                                <Modal.Title>{item.name}</Modal.Title>
                                <p>{item.description}</p>
                                <p>$ {item.price}</p>
                                
                                {/* Notes for Menu Item */}
                                <FormLabel>Add notes</FormLabel>
                                <InputGroup>
                                    <FormControl 
                                        onChange={this.handleNotesChange} 
                                        as="textarea" 
                                        aria-label="With textarea" 
                                    />
                                </InputGroup>
                                <br></br>
                                {/* Quantity of Menu Item */}
                                <InputNumber 
                                    onChange={this.handleQuantityChange} 
                                    focusOplaceholder="Quantity" 
                                    min={1} 
                                    defaultValue={1} 
                                />
                                <br></br><br></br>
                                <Button 
                                    onClick={this.handleAddToCart} 
                                    disabled={itemInCart(item)} 
                                    data-dismiss="modal" 
                                    variant="primary"
                                >
                                    Add to cart
                                </Button>

                                {/* Successfully Added Alert */}
                                {itemInCart(item) &&
                                    <Alert variant="success">
                                        Added to cart.
                                    </Alert>}
                            </Tab>
                            <Tab eventKey="review" title="Review">
                                
                            </Tab>
                            
                        </Tabs>
                        
                    </Modal.Body>
                </Modal>}
            </div>
        )
    }
}