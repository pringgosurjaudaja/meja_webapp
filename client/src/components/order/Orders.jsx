import { Button } from 'react-bootstrap';
import { OrderCard } from 'src/components/order/OrderCard';
import { OrderHelper } from 'src/components/order/OrderHelper';
import React from 'react';

export class Orders extends React.Component {
    render() {
        const { orderList } = this.props;

        const orderCards = orderList.map((order, i) => <OrderCard key={i} order={order} />);

        return (<div className='orders'>
            <h1>Orders</h1>
                {orderCards.length === 0 && <div className="orders-empty" align="center">No orders yet! Go place one :)</div>}
                <div style={{ flex: 1 }}>{orderCards}</div>

            <div align="center">
                <div className="orders-total" style={{ display: 'flex' }}>
                    <div style={{ flex: 1 ,  textAlign: 'left'}}>
                        <h4>Net Total:</h4>
                    </div>
                    <div style={{ flex: 1 , textAlign: 'right'}}>
                        <h4>${OrderHelper.getGrandTotal(orderList).toFixed(2)}</h4>
                    </div>
                </div>
                <div align="center">
                    <Button
                        align='center'
                        onClick={this.props.handleCloseOrder}
                        disabled={orderList.length === 0}
                    >
                        Complete Order
                    </Button>
                </div>
            </div>
        </div>);
    }
}