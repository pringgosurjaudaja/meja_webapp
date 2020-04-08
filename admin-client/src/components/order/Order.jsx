import { Container, Tab, Tabs } from 'react-bootstrap';

import { OrderCard } from 'src/components/order/OrderCard';
import React from 'react';
import { orderStatus } from 'src/components/Dashboard';

const ORDER_TABS = {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled'
}

export class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabFilter: ORDER_TABS.active
        }
    }

    filterOrders = (newOrderFilter) => {
        const { orders } = this.props;

        switch (newOrderFilter) {
            case ORDER_TABS.active:
                return orders.filter(order => {
                    return order.status === orderStatus.ORDERED || 
                           order.status === orderStatus.PROGRESS;
                });
            case ORDER_TABS.completed:
                return orders.filter(order => {
                    return order.status === orderStatus.COMPLETED;
                });
            case ORDER_TABS.cancelled:
                return orders.filter((order => {
                    return order.status === orderStatus.CANCELLED;
                }));
            default:
                return orders;
        }
    }

    render() {
        const { changeOrderStatus } = this.props;

        return (
            <Container fluid>
                <Tabs 
                    className="justify-content-center"
                    id='order-control-tabs' 
                    activeKey={this.state.activeKey}
                    onSelect={(key) => this.setState({ tabFilter: key })}    
                >
                    {Object.keys(ORDER_TABS).map((key, i) => {
                        return <Tab key={i} eventKey={key} title={ORDER_TABS[key]} />;
                    })}
                </Tabs>

                <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                    {this.filterOrders(ORDER_TABS[this.state.tabFilter]).map(
                        (order, i) => {
                            return <OrderCard 
                                        key={i} 
                                        order={order}
                                        orderNumber={i}
                                        changeOrderStatus={changeOrderStatus} 
                                    />;
                        }
                    )}
                </div>
            </Container>
        )
    }
}