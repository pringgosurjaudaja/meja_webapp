import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export class CartEntry extends React.Component {

    render() {
        const { item, handleQuantityChange } = this.props;

        return (
            <Card className='checkout-cartentry'>
                <Card.Body>
                    <div className='checkout-cartentry-trash'>
                        <FontAwesomeIcon 
                            icon={faTrash} 
                            onClick={() => this.handleDeleteItem(item)} 
                        />
                    </div>
                    <Card.Title>{item.menu_item.name}</Card.Title>
                    <Card.Subtitle>$ {item.menu_item.price}</Card.Subtitle>
                    {item.notes && <Card.Text>{item.notes}</Card.Text>}
                    <br />
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button className='checkout-cart-btn' onClick={() => handleQuantityChange(item, --item.quantity)}>-</Button>
                        <h3>{item.quantity}</h3>
                        <Button className='checkout-cart-btn' onClick={() => handleQuantityChange(item, ++item.quantity)}>+</Button>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}