import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { cartOps } from 'components/Dashboard';
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
            total += item.menuItem.price * item.quantity;
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

    handleConfirmOrder() {
        // Create new order
        // let url = 'http://127.0.0.1:5000/orders/';
        // axios({
        //     method: 'post',
        //     url: url,
        //     timeout: 1000,
        //     header: {
        //         "x-api-key": sessionStorage.getItem('AUTH_KEY'),
        //     }
        // })
        // .then((response) => {
        //     console.log(response);
        // })
        // .catch((error)=>{
        //     console.log(error.response);
        // });
        // window.location.reload();

        // Then dont forget to add menu items

        //  Dont forget to check for empty cart
        console.log('Order submitted');
        // const order = {
        //     // Insert session information here
        //     table_id:
        //     user_name:
        //     new_order:
        // }

        // this.socket.emit('new_order', order);
    }

    render() {
        const { cart } = this.props;
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
                        <Card.Title>{item.menuItem.name}</Card.Title>
                        <Card.Subtitle>$ {item.menuItem.price}</Card.Subtitle>
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
            <div className="margin-center">
                <h1>Order</h1>
                {entries.length > 0 ? entries : 'Empty Cart'}
                <br />

                <p>Total: $ {this.getTotal()}</p>

                <Button align='center' onClick={() => this.handleConfirmOrder()}>
                    Order Now
                </Button>
            </div>
        );
    }
}
