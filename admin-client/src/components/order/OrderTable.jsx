import { Card, Table } from 'react-bootstrap';

import React from 'react';

export class OrderTable extends React.Component {
    getTotal = () => {
        const { order } = this.props;
        
        let total = 0;
        order.order_items.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menu_item.price;
        });
        
        return total;
    }
    
    render() {
        const { order } = this.props;

        return (
            <Card.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((orderItem, j) => {
                            return (<tr key={j}>
                                <th>{orderItem.quantity}</th>
                                <th>
                                    <Card.Title>
                                        {orderItem.menu_item.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {orderItem.notes}
                                    </Card.Text>
                                </th>
                                <th>${orderItem.menu_item.price}</th>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Card.Title>Total: ${this.getTotal()}</Card.Title>
            </Card.Body>
        )
    }
}