import { Button, ButtonGroup, Card } from 'react-bootstrap';

import { OrderTable } from 'src/components/order/OrderTable';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { orderStatus } from 'src/components/Dashboard';

export class OrderCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: Date.now(),
            tableName: '',
            userName: ''
        }
    }

    componentDidMount = async () => {
        const { order } = this.props;

        this.timeElapsed = setInterval(() => this.tick(), 1000);

        if (order.table_id && order.user_id) {
            const table = await Requests.getTable(order.table_id);
            table && this.setState({ tableName: table.name });
    
            const user = await Requests.getUser(order.user_id);
            user && this.setState({ userName: user.name });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timeElapsed);
    }

    truncateId = (id) => {
        return id.slice(0, 10) + '...';
    }    

    // #region Time Elapsed Functions
    tick = () => {
        this.setState({ currentTime: Date.now() });
    }

    getTimeElapsed = () => {
        let orderStart = new Date(this.props.order.timestamp);
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
    // #endregion

    // #region Order Status Functions
    isActive = () => {
        const { order } = this.props;
        return order.status === orderStatus.ORDERED || order.status === orderStatus.PROGRESS;
    }

    orderStatusButtons = () => {
        const { changeOrderStatus, order, disabled } = this.props;
        const statusButtonVariantMap = new Map([
            [orderStatus.ORDERED, 'warning'],
            [orderStatus.PROGRESS, 'info'],
            [orderStatus.COMPLETED, 'success'],
            [orderStatus.CANCELLED, 'danger'],
        ]);
        
        if (disabled) {
            return <Button
                        className='order-status-btn'
                        variant={statusButtonVariantMap.get(order.status)}>
                {order.status}
            </Button>;
        }
    
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
    // #endregion

    render() {
        const { order } = this.props;

        return (
            <Card className="order-card" style={{ width: '30vw', margin: '10px' }}>
                <Card.Header>
                    <Card.Title>Order #{this.truncateId(order._id)}</Card.Title>
                    {this.state.tableName && this.state.userName && (
                        <div>
                            <div style={{ marginBottom: '10px' }}>
                                <Card.Subtitle>Table: <strong>{this.state.tableName}</strong></Card.Subtitle>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Card.Subtitle>Customer: <strong>{this.state.userName}</strong></Card.Subtitle>
                            </div>
                        </div>
                    )}
                    {this.orderStatusButtons()}
                    {this.isActive() &&
                        <div className="order-time">
                            <Card.Subtitle>Time Elapsed:</Card.Subtitle>
                            <Card.Text>{this.getTimeElapsed()}</Card.Text>
                        </div>
                    }
                </Card.Header>
                <OrderTable order={order} />
            </Card>
        );
    }
}