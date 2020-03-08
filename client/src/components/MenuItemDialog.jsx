import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'styles/styles.css';
import example from './assets/test.jpg';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddCart = this.handleAddCart.bind(this);
        this.state = {
            addCart: false,
            amount: '',
            notes: '',
            status: '',
            order_id: ''
        }
    }

    handleAddCart(e) { 
        e.preventDefault();
        let obj = {};

        obj["menu_item_id"] = this.props.id;
        obj["amount"] = this.state.price;
        obj["notes"] = this.state.notes;
        obj["status"] = false;
        // obj["order_id"] = '';

        const instance = axios.create({
            baseURL: 'http://127.0.0.1:5000',
            timeout: 100,
        });
        console.log(obj);
        instance.get('/menu')
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })

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
                        <Card.Img variant="top" src={example}/>
                        <Modal.Title>{ this.props.name }</Modal.Title>
                        <p>{ this.props.description }</p>
                        <p><InputNumber focusOplaceholder="Quantity" min={1} defaultValue={1}/></p>
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