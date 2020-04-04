import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { orderStatus } from 'components/Dashboard';

export class OrderCard extends React.Component {
    constructor(props) {
        super(props);
    }

    getTotal = (order) => {
        let total = 0;
        order.order_items.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menu_item.price;
        });
        return total;
    }

    handleStatusChange = (newStatus) => {
        this.props.order.status = newStatus;
    }

    orderStatusButtons = (order) => {
        const { changeOrderStatus, orderNumber } = this.props;

        const statusButtonVariantMap = new Map([
            [orderStatus.ORDERED, 'warning'],
            [orderStatus.PROGRESS, 'primary'],
            [orderStatus.COMPLETED, 'success'],
            [orderStatus.CANCELLED, 'danger'],
        ]);
    
        return (<div>
            {[...statusButtonVariantMap.entries()].map(([status, variant], i) => {
                let buttonVariant = variant;
                if (status !== order.status) {
                    buttonVariant = 'outline-' + buttonVariant;
                }
                return <Button 
                    key={i}
                    style={{ margin: '10px' }}
                    variant={buttonVariant}
                    onClick={() => changeOrderStatus(status, order._id)}
                >
                    {status}
                </Button>;
            })}
        </div>);
    }

    render() {
        const { order } = this.props;

        return (
            <Card style={{ width: '30vw', margin: '10px' }}>
                <Card.Header>
                    <Card.Title>Order</Card.Title>
                    <Card.Subtitle>#{order._id}</Card.Subtitle>
                    {this.orderStatusButtons(order)}
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
                                        <Card.Text>
                                            {orderItem.notes}
                                        </Card.Text>
                                    </th>
                                    <th>${orderItem.menu_item.price}</th>
                                </tr>)
                            })}
                        </tbody>
                    </Table>
                    <Card.Title>Total: ${this.getTotal(order)}</Card.Title>
                </Card.Body>
            </Card>
        );
    }
}