import React from 'react';
import { Modal, Button, Card, Alert, InputGroup, FormControl } from 'react-bootstrap';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import 'styles/styles.css';
import example from './assets/test.jpg';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.state = {
            // keep array reference in variable whole time page is active
            cartArray: [],
            addCart: false,
            quantity: 1,
            notes: ''
        }
    }

    componentDidMount() {
        let cartArray = JSON.parse(sessionStorage.getItem('cart') || '[]');
        this.setState({ cartArray: cartArray});
    }

    handleQuantityChange(val) {
        this.setState({ value: val });
    }

    handleNotesChange(e) {
        this.setState({ notes: e.target.value.toString() });
    }

    handleAddToCart() {
        var values = {
            [this.props.id]: {
                name: this.props.name,
                price: this.props.price,
                quantity: this.state.quantity,
                notes: this.state.notes
            }
        };

        // console.log(values);

        var cartObj = this.state.cartArray;
        console.log('Before');
        console.log(cartObj);
        cartObj.push(values);
        console.log('Pushed');
        console.log(cartObj);
        sessionStorage.setItem("cart", JSON.stringify(cartObj)); 
        this.setState({ cartArray: cartObj });
        this.setState({ addCart: true });
        // window.location.reload(true);
        console.log('ADDED ITEM');

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

                        Add notes
                        <InputGroup>
                            <FormControl  onChange={this.handleNotesChange} as="textarea" aria-label="With textarea" />
                        </InputGroup>

                        <InputNumber onChange={this.handleQuantityChange} focusOplaceholder="Quantity" min={1} defaultValue={1} />
                        <p></p>
                        <Button onClick={this.handleAddToCart} disabled={this.state.addCart} data-dismiss="modal" variant="primary">
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