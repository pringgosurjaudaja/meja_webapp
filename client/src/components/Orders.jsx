import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { orderStatus } from 'components/Dashboard';

export class Orders extends React.Component {
    constructor(props) {
        super(props);
    }

    getTotal = (order) => {
        let total = 0;
        order.orderItems.forEach(orderItem => {
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

    orderStatusIndicator = (order) => {
        let variant = 'outline-warning';
        switch (order.status) {
            case orderStatus.PROGRESS:
                variant = 'outline-primary';
                break;
            case orderStatus.COMPLETED:
                variant = 'outline-success';
                break;
            case orderStatus.CANCELLED:
                variant = 'outline-danger';
                break;
        }

        return (<Button disabled variant={variant}>{order.status}</Button>)
    }

    // #region Component Rendering
    orderCard = (order, i) => {
        return (<Card key={i} style={{ width: '95%' }}>
            <Card.Header>
                <Card.Title>Order #{i + 1}</Card.Title>
                {this.orderStatusIndicator(order)}
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
                        {order.orderItems.map((orderItem, j) => {
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
        </Card>);
    }
    // #endregion

    render() {
        const { orderList } = this.props;

        const orderCards = orderList.map((order, i) => this.orderCard(order, i));

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