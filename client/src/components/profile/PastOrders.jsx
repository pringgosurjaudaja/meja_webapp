import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';

import { Card, Col, Row, Table } from 'react-bootstrap';

import { OrderHelper } from 'src/components/order/OrderHelper';
import React from 'react';
import { Requests } from 'src/utilities/Requests';

export class PastOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            orders: [],
        }
    }

    componentDidMount = async () => {
        const userId = await this.getUserId();
        const orders = await this.getPastOrders(userId);
        this.setState({ orders: orders });
    }

    getUserId = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const allSession = await Requests.getAuth(sessionId);
        let userId = "";
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                this.setState({ userId: sess._id });
                userId = sess._id;
                return;
            }
        })
        return userId;
    }
    getPastOrders = async (userId) => {
        return await Requests.getPastOrders(this.state.userId);
    }

    getOrderCard = () => {


        let res = [];
        this.state.orders && this.state.orders.forEach((item, index) => {

            let datetime = item.timestamp ? item.timestamp.split("T") : "";
            let date = datetime[0];
            let time = datetime[1].substring(0, 8);

            let timestamp = item.timestamp ? "Made on " + date + " at " + time : "";
            let card = (
                <Card key={index} className="order-card" style={{ width: '100%' }}>
                    <Card.Header>
                        <Card.Title>Order</Card.Title>
                        <Card.Subtitle>#{item._id}</Card.Subtitle>
                        <Card.Subtitle>{timestamp}</Card.Subtitle>

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
                                {item.order_items.map((orderItem, j) => {
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
                        <Card.Title>Total: ${OrderHelper.getTotal(item)}</Card.Title>
                    </Card.Body>
                </Card>
            );
            res.push(card)
        })
        return res;
    }


    render() {
        return (
            <div className="orders">
                <Row>
                    <Col>
                        <h2 className="past-orders" align="center">Past Orders</h2>
                        {this.state.orders.length === 0 &&
                            <h5 className="profile-email" align="center">No past orders.</h5>}
                        {this.state.orders && this.getOrderCard()}
                    </Col>
                </Row>
            </div>
        );
    }
}