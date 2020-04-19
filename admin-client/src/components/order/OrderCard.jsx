import { Button, ButtonGroup, Card, Table } from 'react-bootstrap';

import React from 'react';
import { orderStatus } from 'src/components/Dashboard';

export class OrderCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: Date.now()
        }
    }

    componentDidMount() {
        this.timeElapsed = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timeElapsed);
    }

    tick = () => {
        this.setState({ currentTime: Date.now() });
    }

    getTotal = (order) => {
        let total = 0;
        order.order_items.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menu_item.price;
        });
        return total;
    }

    getTimeElapsed = (order) => {
        let orderStart = new Date(order.timestamp);
        let secondsElapsed = Math.floor((this.state.currentTime - orderStart.getTime()) / 1000);
        let minutes = Math.floor(secondsElapsed / 60);
        let hours = Math.floor(secondsElapsed / 3600);
        minutes -= hours * 60;
        let seconds = secondsElapsed % 60;

        let time = '';
        if (hours > 0)    time += `${hours} hours `;
        if (minutes > 0)  time += `${minutes} minutes `;
        if (seconds > 0)  time += `${seconds} seconds `;

        return time;
    }

    orderStatusButtons = (order) => {
        const { changeOrderStatus, orderNumber } = this.props;

        const statusButtonVariantMap = new Map([
            [orderStatus.ORDERED, 'warning'],
            [orderStatus.PROGRESS, 'info'],
            [orderStatus.COMPLETED, 'success'],
            [orderStatus.CANCELLED, 'danger'],
        ]);
    
        return (<ButtonGroup className="flex-wrap">
            {[...statusButtonVariantMap.entries()].map(([status, variant], i) => {
                let buttonVariant = variant;
                if (status !== order.status) {
                    buttonVariant = 'outline-' + buttonVariant;
                }
                return <Button 
                    key={i}
                    className="order-status-btn"
                    variant={buttonVariant}
                    onClick={() => changeOrderStatus(status, order._id)}
                >
                    {status}
                </Button>;
            })}
        </ButtonGroup>);
    }

    render() {
        const { order } = this.props;

        return (
            <Card className="order-card" style={{ width: '30vw', margin: '10px' }}>
                <Card.Header>
                    <Card.Title>Order</Card.Title>
                    <Card.Subtitle>#{order._id}</Card.Subtitle>
                    {this.orderStatusButtons(order)}
                    <div class="order-time">
                        <Card.Subtitle>Time Elapsed:</Card.Subtitle>
                        <Card.Text>{this.getTimeElapsed(order)}</Card.Text>
                    </div>
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
                    <Card.Title>Total: ${this.getTotal(order)}</Card.Title>
                </Card.Body>
            </Card>
        );
    }
}