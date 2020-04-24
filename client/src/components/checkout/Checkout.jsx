import 'rc-input-number/assets/index.css';

import { Button, Modal } from 'react-bootstrap';

import { CartEntry } from 'src/components/checkout/CartEntry';
import React from 'react';
import { cartOps } from 'src/components/Dashboard';
import io from 'socket.io-client';

export class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io.connect('http://127.0.0.1:5000/customer');
    }

    componentDidMount() {
        this.socket.on('orderReceived', (data) => {
            console.log('Received your order!');
            console.log(data);
        });
    }

    getTotal() {
        let total = 0;
        this.props.cart.forEach(item => {
            total += item.menu_item.price * item.quantity;
        });
        return total;
    }

    handleDeleteItem = (orderItem) => {
        this.props.updateCart(orderItem, cartOps.DELETE);
    }

    handleQuantityChange = (orderItem, newQuantity) => {
        orderItem.quantity = Math.max(1, newQuantity);
        this.props.updateCart(orderItem, cartOps.UPDATE);
    }

    render() {
        const { cart, handleOrderCart, show, onHide } = this.props;
        let entries = cart.size > 0 && 
                      [...cart.values()].map((item, i) => <CartEntry handleDeleteItem={this.handleDeleteItem} handleQuantityChange={this.handleQuantityChange} key={i} item={item} />);

        return (
            <Modal
                className="overlay-cart"
                show={show}
                onHide={onHide}
            >
                <Modal.Header className='overlay-closebtn' closeButton>
                    <h1>Cart</h1>
                </Modal.Header>
                {entries.length > 0 ?
                <Modal.Body>
                    <div>
                        {entries}
                        <br />
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 1 }}>
                                <h4>Total:</h4>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <h4>$ {this.getTotal().toFixed(2)}</h4>
                            </div>
                        </div>
                        <Button 
                            className='overlay-button'
                            align='center' 
                            onClick={handleOrderCart}
                            disabled={entries.length === 0}
                        >
                            Order Now
                        </Button>
                    </div>
                </Modal.Body> :
                <Modal.Body>
                    <p>Your cart is currently empty. Check out our menu and add some items!</p>
                </Modal.Body>
                }
            </Modal>
        );
    }
}
