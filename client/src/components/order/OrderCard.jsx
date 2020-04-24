import { Button, Card, Table } from 'react-bootstrap';

import { OrderHelper } from 'src/components/order/OrderHelper';
import React from 'react';
import { orderStatus } from 'src/components/Dashboard';

export class OrderCard extends React.Component {
    orderStatusIndicator = (currOrderStatus) => {
        let variant;
        switch (currOrderStatus) {
            case orderStatus.ORDERED:
                variant = 'warning';
                break;
            case orderStatus.PROGRESS:
                variant = 'info';
                break;
            case orderStatus.COMPLETED:
                variant = 'success';
                break;
            case orderStatus.CANCELLED:
                variant = 'danger';
                break;
            default:
                break;
            }
        return (<Button variant={variant} size="sm">{currOrderStatus}</Button>)
    }

    render() {
        const { order } = this.props;

        return (<Card className="order-card" style={{ width: '100%' }}>
            <Card.Header>
                <Card.Title>Order</Card.Title>
                <Card.Subtitle>#{order._id}</Card.Subtitle>
                {this.orderStatusIndicator(order.status)}
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
                        {order.order_items.map((orderItem, j) => {
                            return (<tr key={j}>
                                <th>{orderItem.quantity}</th>
                                <th>
                                    <Card.Title>
                                        {orderItem.menu_item.name}
                                    </Card.Title>
                                    <Card.Text className="order-notes">
                                        {orderItem.notes}
                                    </Card.Text>
                                </th>
                                <th>${orderItem.menu_item.price}</th>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Card.Title>Total: ${OrderHelper.getTotal(order)}</Card.Title>
            </Card.Body>
        </Card>);
    }
}