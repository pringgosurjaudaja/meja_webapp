import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
import { navigate } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { About } from 'components/About';
import { Orders } from 'components/Orders';
import { axios } from 'utilities/helper';
import io from 'socket.io-client';

export const cartOps = {
    ADD: 'add',
    DELETE: 'delete',
    UPDATE: 'update'
}

const tabs = {
    ALL: 'all',
    ABOUT: 'about',
    ORDERS: 'orders',
    CHECKOUT: 'checkout'
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
            tableId: '123',
            user: 'Guest',
            orderList: [],
            cart: new Map()
        };
        this.socket = io.connect('http://127.0.0.1:5000/')
    }

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

    handleSelect = (event) => {
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/login');
        }
    }

    handleOrderCart = async () => {
        const order = {
            order_items: [...this.state.cart.values()],
            status: orderStatus.ORDERED
        };
        let newOrderList = [...this.state.orderList];
        newOrderList.push(order);

        // Send order to be stored in database
        await axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/order',
            data: {
                table_id: '123',
                ...order
            }
        }).catch(err => {
            console.error(err);
        });

        // Add order to order list, empty cart and navigate to order list
        this.setState({ 
            orderList: newOrderList, 
            cart: new Map(),
            activeTab: tabs.ORDERS
        });
    }

    handleCloseOrder = () => {
        console.log('Closing Order and Paying');
        console.log(this.state.orderList);

        // Send entire session info to the backend to be stored in db
    }    

    render() {
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

                    <Tab eventKey={tabs.ALL} title="All">
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
                </Tabs>
            </div>


        );
    }
}