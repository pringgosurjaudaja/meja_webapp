import React from 'react';
import { Button } from 'react-bootstrap';
import { OrderCard } from 'src/components/order/OrderCard';
import { OrderHelper } from 'src/components/order/OrderHelper';

export class Orders extends React.Component {
    render() {
        const { orderList } = this.props;

        const orderCards = orderList.map((order, i) => <OrderCard key={i} order={order} />);

        return (<div className='margin-center'>
            <h1>Orders</h1>
            {orderCards}
            <h5 align="center" className="orders-total">Net Total: ${OrderHelper.getGrandTotal(orderList)}</h5>
            <div align="center">
                <Button
                    align='center'
                    onClick={this.props.handleCloseOrder}
                    disabled={orderList.length === 0}
                >
                    Complete Order
                </Button>
            </div>
        </div>);
    }
}