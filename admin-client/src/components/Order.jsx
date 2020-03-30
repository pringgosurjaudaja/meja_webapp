import React from 'react';
import { OrderCard } from 'components/OrderCard';

export class Order extends React.Component {    
    render() {
        const { orders, changeOrderStatus } = this.props;

        return (
            <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                {orders.map(
                    (order, i) => 
                    <OrderCard 
                        key={i} 
                        order={order}
                        orderNumber={i}
                        changeOrderStatus={changeOrderStatus}
                    />
                )}
            </div>
        )
    }
}