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
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.state={
            cartArray: []
        };
        
    }

    componentDidMount() {
        let cartArray = JSON.parse(sessionStorage.getItem('cart') || '[]');
        this.setState({ cartArray: cartArray});
    }

    handleQuantityChange(val) {
        this.setState({ value: val });
        console.log("QUANTITY: " + val);
    }

    render () {
        let entries = [];
        this.state.cartArray.length > 0 && this.state.cartArray.forEach((item, key) => {
            // let item = this.state.cartArray.get(keyStr);

            console.log('HERE');
            console.log(key);
            console.log(item);
            // let entry = (
            //         <Card {...this.props} style={{ width: '95%' }}>
            //             <Card.Body>
            //                 <Card.Text>
            //                     <div align="right"><FontAwesomeIcon icon={faTrash}/></div>
            //                     {item.name}
            //                     <br></br>
            //                     <small className="text-muted">{item.notes}</small>
            //                     <br></br>
            //                     <InputNumber focusOplaceholder="Quantity" min={1} defaultValue={item.quantity}/>
            //                     <div class="price" align="right">{item.price}</div>
            //                 </Card.Text>
            //             </Card.Body>
            //         </Card>
            // );
            // entries.push(entry);
        });
        return (
            <div class="margin-center">         
                <h1>Order</h1>
                { this.state.cartArray.length > 0 && entries}
                { this.state.cartArray.length == 0 && 'Empty cart' }
                <br></br>
                <p align="center"><Button>Back to menu</Button></p>
                <p align="center"><Button>Order now</Button></p>
            </div>
        );
    }
}
