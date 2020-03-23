import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
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
            let cart_item = Object.values(item)[0];
            total += cart_item.price * cart_item.quantity;
        });
        return total;
    }

    handleDeleteItem(index) {
        let cartObj = this.props.cart;
        console.log('BEFORE');
        console.log(cartObj);

        cartObj.forEach((item, i) => {
            if (i === index) {
                cartObj.splice(index, 1);
            }
        });

        console.log('AFTER');
        console.log(cartObj);
        this.props.updateCart(cartObj);
        this.setState({ cartArray: cartObj });
        console.log('DELETED ITEM');
        this.handleUpdateTotal();
    }

    handleQuantityChange(index, val) {
        console.log(index);
        console.log(val);
        let cartObj = this.props.cart;
        console.log('BEFORE');
        console.log(cartObj);

        cartObj.forEach((item, i) => {
            if (i === index) {
                Object.assign(Object.values(item)[0], { quantity: val })
            }
        });


        console.log('AFTER');
        console.log(cartObj);
        this.props.updateCart(cartObj);
        this.setState({ cartArray: cartObj });
        console.log('ADDED ITEM');
        this.handleUpdateTotal();
    }

    handleUpdateTotal() {
        let sum = 0;
        this.props.cart.length > 0 && this.props.cart.forEach((item, index) => {
            let i = Object.values(item)[0];
            let val = i.price * i.quantity;
            sum = sum + val;
        });
        this.setState({ total: sum });
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
        const order = {
            // Insert session information here
            order_id: '123',
            cart: this.props.cart
        }
        this.socket.emit('new_order', order);
    }

    render() {
        const { cart } = this.props;
        let entries = [];

        cart.length > 0 && cart.forEach((item, index) => {
            console.log(item);
            let val = Object.values(item)[0];
            console.log(val);
            let entry = (
                <Card key={Object.keys(item)[0]} {...this.props} style={{ width: '95%' }}>
                    <Card.Body>
                        <Card.Text>
                            <div align="right">
                                <FontAwesomeIcon onClick={() => this.handleDeleteItem(index)} icon={faTrash} />
                            </div>
                            {val.name}
                            <br></br>
                            <small className="text-muted">{val.notes}</small>
                            <br></br>
                            <InputNumber onChange={(value) => this.handleQuantityChange(index, value)} focusOplaceholder="Quantity" min={1} defaultValue={val.quantity} />
                            <div className="price" align="right">$ {val.price}</div>
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
            entries.push(entry);
        });
        return (
            <div className="margin-center">
                <h1>Order</h1>
                {this.props.cart.length > 0 ? entries : 'Empty Cart'}
                <br />

                <p>Total: $ {this.getTotal()}</p>

                <Button align='center' onClick={() => this.handleConfirmOrder()}>
                    Order Now
                </Button>
            </div>
        );
    }
}
