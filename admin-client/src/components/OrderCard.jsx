import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { orderStatus } from 'components/Dashboard';

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
                    <Card.Subtitle>Time Elapsed:</Card.Subtitle>
                    <Card.Text>{this.getTimeElapsed(order)}</Card.Text>
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