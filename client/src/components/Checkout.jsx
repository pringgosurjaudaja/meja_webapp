import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

export class Checkout extends React.Component {
    render () {
        return (
            <div class="margin-center">
                <h1>Order</h1>
                <Card {...this.props} style={{ width: '95%' }}>
                    <Card.Body>
                        <Card.Text>
                            <div align="right"><FontAwesomeIcon icon={faTrash}/></div>
                            Menu item<br></br>
                            <small className="text-muted">This is a custom note added by the customer</small>
                            <InputNumber focusOplaceholder="Quantity" min={1} defaultValue={1}/>
                            <div class="price" align="right">$16.00</div>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br></br>
                <p align="center"><Button>Back to menu</Button></p>
                <p align="center"><Button>Order now</Button></p>
            </div>
        );
    }
}

export default Checkout;