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
            tabFilter: ORDER_TABS.active,
        }
    }

    filterOrders = (newOrderFilter) => {
        const { orders } = this.props;

        if (!orders) {
            return []
        }

        switch (newOrderFilter) {
            case ORDER_TABS.all:
                return orders;
            case ORDER_TABS.completed:
                return orders.filter(order => {
                    return order.status === orderStatus.COMPLETED;
                });
            case ORDER_TABS.cancelled:
                return orders.filter((order => {
                    return order.status === orderStatus.CANCELLED;
                }));
            default:
                return orders.filter(order => {
                    return order.status === orderStatus.ORDERED || 
                           order.status === orderStatus.PROGRESS;
                });
        }
    }

    render() {
        const { changeOrderStatus } = this.props;

        const ordersToDisplay = this.filterOrders(this.state.tabFilter);

        return (
            <Container fluid>
                <Tabs 
                    className="justify-content-center"
                    id='order-control-tabs' 
                    activeKey={this.state.tabFilter}
                    onSelect={(key) => this.setState({ tabFilter: key })}    
                >
                    {Object.keys(ORDER_TABS).map((key, i) => {
                        return <Tab key={i} eventKey={ORDER_TABS[key]} title={ORDER_TABS[key]} />;
                    })}
                </Tabs>

                <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                    {ordersToDisplay.length ? 
                     ordersToDisplay.map((order, i) => {
                            return <OrderCard 
                                        key={i} order={order}
                                        changeOrderStatus={changeOrderStatus} />;
                     }) :
                     <h3 style={{ margin: '20px' }}>No {this.state.tabFilter} Orders.</h3>
                    }
                </div>
            </Container>
        )
    }
}