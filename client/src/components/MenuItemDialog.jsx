import React from 'react';
import { Modal, Button, Card, Alert } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'styles/styles.css';
import axios from 'utilities/helper';
import example from './assets/test.jpg';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddCart = this.handleAddCart.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.state = {
            addCart: false,
            quantity: 0,
            amount: 0,
            notes: '',
            order_id: null
        }
    }

    handleQuantityChange(e) {
        this.setState({ value: e.value });
        console.log("QUANTITY: " + e.value);
    }

    handleAddCart(e) {
        e.preventDefault();
        let obj = {};

        obj["menu_item_id"] = this.props.id;
        obj["amount"] = this.state.quantity * this.props.price;
        obj["notes"] = this.state.notes;
        obj["order_id"] = 1;
        console.log(obj);

        axios.post('/user', { obj })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        this.setState({ addCart: true });
        console.log("added to cart");
        return this.props.onHide;
    }

    render() {
        return (
            <div>
                <Modal dialogClassName='menu-item-dialog' {...this.props}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Img variant="top" src={example} />
                        <Modal.Title>{this.props.name}</Modal.Title>
                        <p>{this.props.description}</p>
                        <InputNumber onChange={this.handleQuantityChange} focusOplaceholder="Quantity" min={1} defaultValue={1} />
                        <p></p>
                        <Button onClick={this.handleAddCart} data-dismiss="modal" variant="primary">
                            Add to cart
                        </Button>
                        {this.state.addCart &&
                            <Alert variant="success">
                                Added to cart.
                            </Alert>
                        }
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