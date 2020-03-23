import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

export class Checkout extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.handleDeleteItem = this.handleDeleteItem.bind(this);
    //     this.handleQuantityChange = this.handleQuantityChange.bind(this);
    //     this.handleUpdateTotal = this.handleUpdateTotal.bind(this);
    //     this.handleConfirmOrder = this.handleConfirmOrder.bind(this);
    //     this.state = {
    //         cartArray: this.props.cart,
    //         total: 0
    //     };

    // }

    // componentDidMount() {
    //     let cartArray = this.props.cart;
    //     this.setState({ cartArray: cartArray });
    //     this.handleUpdateTotal();
    // }

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
                {this.props.cart.length > 0 && entries}
                {this.props.cart.length === 0 && 'Empty cart'}
                <br></br>
                Total: $ {this.getTotal()}
                <p align="center"><Button onClick={this.handleConfirmOrder}>Order now</Button></p>
            </div>
        );
    }
}
