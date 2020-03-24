import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';

export class Orders extends React.Component {
    constructor(props) {
        super(props);
    }

    getTotal = (order) => {
        let total = 0;
        order.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menuItem.price;
        });
        return total;
    }

    getGrandTotal = () => {
        // Sums up the total of all the orders
        return this.props.orderList
                    .map(order => this.getTotal(order))
                    .reduce((a, b) => a + b, 0);
    }

    render() {
        const { orderList } = this.props;

        const orderCards = orderList.map((order, i) => {
            console.log(order);
            return (
                <Card key={i} style={{ width: '95%' }}>
                    <Card.Header>
                        Order #{i + 1}
                    </Card.Header>
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
                                {order.map((orderItem, j) => {
                                    return (<tr key={j}>
                                        <th>{orderItem.quantity}</th>
                                        <th>
                                            <Card.Title>
                                                {orderItem.menuItem.name}
                                            </Card.Title>
                                            <Card.Text>
                                                {orderItem.notes}
                                            </Card.Text>
                                        </th>
                                        <th>${orderItem.menuItem.price}</th>
                                    </tr>)
                                })}
                            </tbody>
                        </Table>
                        <Card.Title>Total: ${this.getTotal(order)}</Card.Title>
                    </Card.Body>
                </Card>
            )
        });

        return (<div className='margin-center'>
            <h1>Orders</h1>
            {orderCards}
            <h5>Net Total: ${this.getGrandTotal()}</h5>
            <Button 
                align='center' 
                onClick={this.props.handleCloseOrder}
                disabled={orderList.length === 0}
            >
                Complete Order
            </Button>
        </div>);
    }
}