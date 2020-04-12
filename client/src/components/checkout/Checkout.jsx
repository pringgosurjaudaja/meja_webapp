import React from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { cartOps } from 'src/components/Dashboard';
import io from 'socket.io-client';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

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
        orderItem.quantity = newQuantity;
        this.props.updateCart(orderItem, cartOps.UPDATE);
    }

    render() {
        const { cart, handleOrderCart, show, onHide } = this.props;
        let entries = [];

        cart.size > 0 && cart.forEach((item, i) => {
            console.log(item);
            entries.push(
                <Card key={i} style={{ width: '95%' }}>
                    <Card.Body>
                        <div align="right">
                            <FontAwesomeIcon 
                                icon={faTrash} 
                                onClick={() => this.handleDeleteItem(item)} 
                            />
                        </div>
                        <Card.Title>{item.menu_item.name}</Card.Title>
                        <Card.Subtitle>$ {item.menu_item.price}</Card.Subtitle>
                        <Card.Text>{item.notes}</Card.Text>
                        <br></br>
                        <InputNumber 
                            onChange={(value) => this.handleQuantityChange(item, value)} 
                            focusOplaceholder="Quantity" 
                            min={1} 
                            defaultValue={item.quantity} 
                        />
                    </Card.Body>
                </Card>
            );
        });

        return (
            <Modal
                className="overlay-cart"
                show={show}
                onHide={onHide}>

                <Modal.Header closeButton>
                    <h1>Checkout</h1></Modal.Header>
                
                <Modal.Body>
                <div className="margin-center">
                    {entries.length > 0 ? entries : 'Empty Cart'}
                    <br />

                    <p>Total: $ {this.getTotal()}</p>

                    <Button 
                        align='center' 
                        onClick={handleOrderCart}
                        disabled={entries.length === 0}
                    >
                        Order Now
                    </Button>
                </div>
                </Modal.Body>
            </Modal>
        );
    }
}
