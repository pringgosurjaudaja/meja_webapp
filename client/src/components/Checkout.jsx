import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

export class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleUpdateTotal = this.handleUpdateTotal.bind(this);
        this.state = {
            cartArray: [],
            total: 0
        };

    }

    componentDidMount() {
        let cartArray = JSON.parse(sessionStorage.getItem('cart') || '[]');
        this.setState({ cartArray: cartArray });
        this.handleUpdateTotal();
    }

    handleDeleteItem(index) {
        let cartObj = this.state.cartArray;
        console.log('BEFORE');
        console.log(cartObj);

        cartObj.forEach((item, i) => {
            if (i === index) {
                cartObj.splice(index, 1);
            }
        });

        console.log('AFTER');
        console.log(cartObj);
        sessionStorage.setItem("cart", JSON.stringify(cartObj));
        this.setState({ cartArray: cartObj });
        console.log('DELETED ITEM');
        this.handleUpdateTotal();
    }

    handleQuantityChange(index, val) {
        console.log(index);
        console.log(val);
        let cartObj = this.state.cartArray;
        console.log('BEFORE');
        console.log(cartObj);

        cartObj.forEach((item, i) => {
            if (i === index) {
                Object.assign(Object.values(item)[0], { quantity: val })
            }
        });


        console.log('AFTER');
        console.log(cartObj);
        sessionStorage.setItem("cart", JSON.stringify(cartObj));
        this.setState({ cartArray: cartObj });
        console.log('ADDED ITEM');
        this.handleUpdateTotal();
    }


    handleUpdateTotal() {
        let sum = 0;
        this.state.cartArray.length > 0 && this.state.cartArray.forEach((item, index) => {
            let i = Object.values(item)[0];
            let val = i.price * i.quantity;
            sum = sum + val;
        });
        this.setState({ total: sum });
    }

    render() {
        let entries = [];
        this.state.cartArray.length > 0 && this.state.cartArray.forEach((item, index) => {
            let val = Object.values(item)[0];
            let entry = (
                <Card key={Object.keys(item)[0]} {...this.props} style={{ width: '95%' }}>
                    <Card.Body>
                        <Card.Text>
                            <div align="right"><FontAwesomeIcon onClick={() => this.handleDeleteItem(index)} icon={faTrash} /></div>
                            {val.name}
                            <br></br>
                            <small className="text-muted">{val.notes}</small>
                            <br></br>
                            <InputNumber onChange={value => this.handleQuantityChange(index, value)} focusOplaceholder="Quantity" min={1} defaultValue={val.quantity} />
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
                {this.state.cartArray.length > 0 && entries}
                {this.state.cartArray.length === 0 && 'Empty cart'}
                <br></br>
                <div className="price">Total: $ {this.state.total}</div>
                <p align="center"><Button>Back to menu</Button></p>
                <p align="center"><Button>Order now</Button></p>
            </div>
        );
    }
}
