import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Menu } from 'src/components/Menu';
import { Checkout } from 'src/components/Checkout';
import { navigate } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { About } from 'src/components/About';
import { Orders } from 'src/components/Orders';
import { Reservation } from 'src/components/Reservation';
import { LoginDialog } from 'src/components/LoginDialog';
import { axios } from 'utilities/helper';
import io from 'socket.io-client';
import 'src/styles/styles.css';

export const cartOps = {
    ADD: 'add',
    DELETE: 'delete',
    UPDATE: 'update'
}

const tabs = {
    ALL: 'all',
    ABOUT: 'about',
    ORDERS: 'orders',
    CHECKOUT: 'checkout',
    RESERVATION: 'reservation',
}

export const orderStatus = {
    ORDERED: 'Ordered',
    PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
}

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: tabs.ABOUT,
            user: 'Guest',
            orderList: [],
            cart: new Map(),
            showLoginDialog: false,
        };
        this.socket = io.connect('http://127.0.0.1:5000/');
        this.setupSockets();
    }

    setupSockets = () => {
        this.socket.on('updateOrders', async (order) => {
            // Update the status of the order that has been changed
            try {
                const request = await axios({
                    method: 'get',
                    url: 'http://127.0.0.1:5000/order/' + order._id
                });
                const updatedOrder = request.data;
                const newOrderList = [...this.state.orderList];
                for (let i = 0; i < newOrderList.length; i++) {
                    if (newOrderList[i]._id === order._id) {
                        newOrderList[i] = updatedOrder;
                        break;
                    }
                }
                this.setState({
                    orderList: newOrderList
                });
            } catch(err) {
                console.error(err);
            }
        });
    }

    // #region Cart Operations
    itemInCart = (menuItem) => {
        return this.state.cart.has(menuItem._id);
    }

    updateCart = (orderItem, operation) => {
        console.log('Updating Cart with order item:');
        console.log(orderItem);
        console.log(operation);
        let oldCart = this.state.cart;
        let newCart = new Map(oldCart);
        
        switch(operation) {
            case cartOps.ADD || cartOps.UPDATE:
                newCart.set(orderItem.menu_item._id, orderItem);
                break;

            case cartOps.DELETE:
                newCart.delete(orderItem.menu_item._id);
                break;
        }

        this.setState({ cart: newCart });
    }
    // #endregion

    showLogin = ()=> {
        this.setState({ showLoginDialog: true });
    }

    // #region Event Handlers
    handleSelect = (event) => {
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/');
        }
    }

    handleOrderCart = async () => {
        const order = {
            session_id: '123',
            table_id: '123',
            order_items: [...this.state.cart.values()],
            status: orderStatus.ORDERED
        }

        // Send order to be stored in database
        try {
            const request = await axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/order',
                data: order
            });

            // Add given generated order id
            order['_id'] = request.data.inserted;

            // Add order to order list, empty cart and navigate to order list
            let newOrderList = [...this.state.orderList];
            newOrderList.push(order);

            this.setState({ 
                orderList: newOrderList, 
                cart: new Map(),
                activeTab: tabs.ORDERS
            });

            // Inform staff of new customer order
            this.socket.emit('customer_order', order);

        } catch(err) {
            console.error(err);
        }
    }

    handleCloseOrder = () => {
        console.log('Closing Order and Paying');
        console.log(this.state.orderList);

        // Send entire session info to the backend to be stored in db
    }
    // #endregion

    render() {

        const reservationProps = {
            showLogin: this.showLogin,
        }

        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon 
                                icon={faSignOutAlt} 
                                transform="grow-10" 
                                color="black" />
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tabs 
                    className="justify-content-center"
                    activeKey={this.state.activeTab}
                    onSelect={(tab => this.setState({ activeTab: tab }))}
                >
                    {/* <Tab eventKey="recommend" title="Recommend">
                        <Recommend {...this.props} />
                    </Tab> */}
                    <Tab eventKey={tabs.ABOUT} title="About">
                        <About />
                    </Tab>

                    <Tab eventKey={tabs.ALL} title="Menu">
                        <Menu 
                            itemInCart={this.itemInCart}
                            updateCart={this.updateCart} 
                            display="all"
                        />
                    </Tab>
                    
                    <Tab eventKey={tabs.ORDERS} title={"Orders"}>
                        <Orders 
                            orderList={this.state.orderList}
                            handleCloseOrder={this.handleCloseOrder}
                        />
                    </Tab>
                    
                    <Tab eventKey={tabs.CHECKOUT} title={<FontAwesomeIcon icon={faShoppingCart} />}>
                        <Checkout 
                            cart={this.state.cart}
                            updateCart={this.updateCart}
                            handleOrderCart={this.handleOrderCart}
                        />
                    </Tab>
                    <Tab eventKey={tabs.RESERVATION} title="Reservation">
                        <Reservation {...reservationProps}/>
                    </Tab>
                </Tabs>
                <LoginDialog show={this.state.showLoginDialog} onHide={()=>this.setState({ showLoginDialog:false })}/>
            </div>


        );
    }
}